"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  HelpCircle,
  GripVertical,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FAQManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const orgId = "demo-org-001";
  
  // Convex queries and mutations
  const faqs = useQuery(api.cms.getFaqs, { orgId });
  const createFaq = useMutation(api.cms.createFaq);
  const updateFaq = useMutation(api.cms.updateFaq);
  const deleteFaq = useMutation(api.cms.deleteFaq);

  const handleSubmit = async () => {
    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          question: formData.question,
          answer: formData.answer,
          category: formData.category || undefined,
        });
      } else {
        await createFaq({
          question: formData.question,
          answer: formData.answer,
          category: formData.category || undefined,
          order: (faqs?.length || 0) + 1,
          orgId,
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    }
  };

  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq({ id });
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "",
    });
  };

  // Group FAQs by category
  const faqsByCategory = faqs?.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              FAQ Management
            </h1>
            <p className="text-gray-500">Manage frequently asked questions</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Services, Pricing, General"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Question *</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What is the question?"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Answer *</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Write the answer..."
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.question || !formData.answer}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingFaq ? "Update FAQ" : "Create FAQ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FAQ Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{faqs?.length || 0}</div>
            <div className="text-sm text-gray-500">Total FAQs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {Object.keys(faqsByCategory || {}).length}
            </div>
            <div className="text-sm text-gray-500">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {faqs?.filter((f) => f.isActive).length || 0}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      <Card>
        <CardContent className="p-6">
          {!faqs || faqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="mb-4">No FAQs yet. Create your first FAQ!</p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First FAQ
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(faqsByCategory || {}).map(([category, categoryFaqs]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline">{category}</Badge>
                    <span className="text-gray-400 text-sm">
                      ({categoryFaqs?.length} items)
                    </span>
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {categoryFaqs?.map((faq) => (
                      <AccordionItem
                        key={faq._id}
                        value={faq._id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-7 pb-2">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {faq.answer}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(faq)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(faq._id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
