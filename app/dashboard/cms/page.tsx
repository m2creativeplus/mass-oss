"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  HelpCircle, 
  Layout, 
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function CMSDashboardPage() {
  const cmsModules = [
    {
      id: "blog",
      title: "Blog Posts",
      description: "Manage blog articles and news",
      icon: FileText,
      href: "/dashboard/cms/blog",
      color: "bg-blue-500",
      stats: { label: "Posts", value: "0" },
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Manage frequently asked questions",
      icon: HelpCircle,
      href: "/dashboard/cms/faq",
      color: "bg-amber-500",
      stats: { label: "Questions", value: "0" },
    },
    {
      id: "pages",
      title: "Dynamic Pages",
      description: "Create custom pages",
      icon: Layout,
      href: "/dashboard/cms/pages",
      color: "bg-purple-500",
      stats: { label: "Pages", value: "0" },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your blog, FAQs, and custom pages
          </p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cmsModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">{module.stats.value}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{module.title}</CardTitle>
                <p className="text-sm text-gray-500 mb-4">{module.description}</p>
                <Link href={module.href}>
                  <Button variant="outline" className="w-full gap-2">
                    Manage {module.title}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/cms/blog?action=new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Blog Post
            </Button>
          </Link>
          <Link href="/dashboard/cms/faq?action=new">
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4" />
              New FAQ
            </Button>
          </Link>
          <Link href="/dashboard/cms/pages?action=new">
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
              New Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
