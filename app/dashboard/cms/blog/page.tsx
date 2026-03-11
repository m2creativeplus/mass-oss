"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Search,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const ORG_ID = "demo-org-001";

type PostStatus = "draft" | "published" | "archived";

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  tags: string;
}

const DEFAULT_FORM: FormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  status: "draft",
  tags: "",
};

export default function BlogManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  const posts = useQuery(api.cms.getBlogPosts, { orgId: ORG_ID });
  const createPost = useMutation(api.cms.createBlogPost);
  const updatePost = useMutation(api.cms.updateBlogPost);
  const deletePost = useMutation(api.cms.deleteBlogPost);
  const generateContent = useAction(api.aiContent.generateBlogPost);

  // ─── Handlers ──────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required.");
      return;
    }
    const toastId = toast.loading(editingPost ? "Updating post..." : "Creating post...");
    try {
      if (editingPost) {
        await updatePost({
          id: editingPost._id,
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.status,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        });
        toast.success("Post updated successfully!", { id: toastId });
      } else {
        await createPost({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.status,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          orgId: ORG_ID,
        });
        toast.success("Post created successfully!", { id: toastId });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save post. Please try again.", { id: toastId });
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.warning("Please enter a topic for the AI to write about.");
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading("✨ AI Content Specialist is drafting your post...");
    try {
      const result = await generateContent({ prompt: aiPrompt, orgId: ORG_ID });
      setFormData({
        title: result.title || "",
        slug: result.slug || "",
        content: result.content || "",
        excerpt: result.excerpt || result.metaDescription || "",
        status: "draft",
        tags: Array.isArray(result.tags) ? result.tags.join(", ") : "",
      });
      toast.success("✅ AI draft ready! Review and publish when ready.", { id: toastId });
      setIsAiDialogOpen(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error("AI generation failed. Please try again.", { id: toastId });
    } finally {
      setIsGenerating(false);
      setAiPrompt("");
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      status: post.status,
      tags: post.tags?.join(", ") || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const toastId = toast.loading("Deleting post...");
    try {
      await deletePost({ id });
      toast.success("Post deleted.", { id: toastId });
    } catch {
      toast.error("Failed to delete post.", { id: toastId });
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData(DEFAULT_FORM);
  };

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <p className="text-gray-500">Manage your blog content</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* AI Generate Dialog */}
          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  AI Content Specialist
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-gray-400">
                  Enter a topic and the MASS OSS Content Agent will generate a complete, SEO-ready blog post for the Somaliland automotive market.
                </p>
                <div className="space-y-2">
                  <Label>Article Topic / Keyword</Label>
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder='e.g. "Brake repair best practices in Hargeisa"'
                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleAiGenerate()}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate Post</>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* New Post Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingPost ? "Edit Post" : "Create New Post"}
                  {!editingPost && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-yellow-500 text-xs gap-1"
                      onClick={() => { setIsDialogOpen(false); setIsAiDialogOpen(true); }}
                    >
                      <Sparkles className="w-3 h-3" /> Use AI
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Excerpt / Meta Description</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary for SEO previews (155-175 characters)"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500">{formData.excerpt.length} / 175 chars</p>
                </div>

                <div className="space-y-2">
                  <Label>Content * (Markdown supported)</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog post content here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v: PostStatus) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="workshop, Somaliland, AI"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.title || !formData.content}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: "Total Posts", value: posts?.length ?? 0 },
          { label: "Published", value: posts?.filter((p) => p.status === "published").length ?? 0 },
          { label: "Drafts", value: posts?.filter((p) => p.status === "draft").length ?? 0 },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredPosts ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">No blog posts yet.</p>
                    <p className="text-sm mt-1">Click <strong>New Post</strong> or use <strong>Generate with AI</strong> to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "published" ? "default" :
                          post.status === "draft" ? "secondary" : "destructive"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{post.viewCount ?? 0}</TableCell>
                    <TableCell>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Preview">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(post._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
