"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Camera, 
  Upload, 
  X, 
  ZoomIn, 
  Trash2,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

interface DVIPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  timestamp: string;
}

interface DVIPhotoUploaderProps {
  photos: DVIPhoto[];
  onPhotosChange: (photos: DVIPhoto[]) => void;
  maxPhotos?: number;
  categories?: string[];
}

export default function DVIPhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 20,
  categories = ["Exterior", "Interior", "Engine", "Undercarriage", "Damage", "Other"],
}: DVIPhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<DVIPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newPhotos: DVIPhoto[] = [];

      for (const file of Array.from(files)) {
        if (photos.length + newPhotos.length >= maxPhotos) break;

        // Convert to base64 for local storage (in production, upload to Convex storage)
        const base64 = await fileToBase64(file);
        
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: base64,
          category: selectedCategory,
          timestamp: new Date().toISOString(),
        });
      }

      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error("Failed to process photos:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [photos, selectedCategory, maxPhotos, onPhotosChange]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  }, []);

  const handleGallerySelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    onPhotosChange(photos.filter((p) => p.id !== photoId));
  }, [photos, onPhotosChange]);

  const updatePhotoCaption = useCallback((photoId: string, caption: string) => {
    onPhotosChange(
      photos.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  }, [photos, onPhotosChange]);

  // Group photos by category
  const photosByCategory = photos.reduce((acc, photo) => {
    const cat = photo.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(photo);
    return acc;
  }, {} as Record<string, DVIPhoto[]>);

  return (
    <div className="space-y-6">
      {/* Upload Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Upload Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={handleCameraCapture}
            disabled={isUploading || photos.length >= maxPhotos}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Camera
          </Button>
          <Button
            onClick={handleGallerySelect}
            disabled={isUploading || photos.length >= maxPhotos}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {/* Photo Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {photos.length} of {maxPhotos} photos
        </span>
        {photos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500"
            onClick={() => onPhotosChange([])}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Photo Grid by Category */}
      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No photos yet. Take or upload photos for the DVI inspection.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(photosByCategory).map(([category, categoryPhotos]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Badge variant="outline">{category}</Badge>
                <span className="text-gray-400">({categoryPhotos.length})</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categoryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "DVI photo"}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => setPreviewPhoto(photo)}
                      >
                        <ZoomIn className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/20"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Caption badge */}
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Preview Dialog */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {previewPhoto && (
            <div className="space-y-4">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.caption || "DVI photo"}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              <div className="flex items-center justify-between">
                <div>
                  <Badge>{previewPhoto.category}</Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(previewPhoto.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deletePhoto(previewPhoto.id);
                    setPreviewPhoto(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
