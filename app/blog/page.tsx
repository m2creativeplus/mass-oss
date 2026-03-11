import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Wrench, Calendar, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every 60 seconds

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  publishedAt?: number;
  viewCount?: number;
}

export default async function BlogIndexPage() {
  // Initialize standard Convex client for server components
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://artful-jaguar-416.convex.cloud");
  
  // Fetch published posts for the default organization
  let posts: BlogPost[] = [];
  try {
    posts = await convex.query(api.cms.getBlogPosts, { 
      orgId: "demo-org-001", 
      status: "published" 
    }) as BlogPost[];
  } catch (error) {
    console.error("Failed to fetch blog posts during build:", error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden flex flex-col pt-24 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center space-y-4 relative z-10 mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          MASS <span className="text-orange-500">Insights</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Expert guides, digital transformation strategies, and automotive technology updates for Somaliland workshops.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="group h-full">
              <article className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:-translate-y-1">
                <div className="p-6 flex flex-col h-full">
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-slate-400 mb-6 line-clamp-3 flex-grow">
                    {post.excerpt || "Read more about this topic..."}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Just now'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {post.viewCount || 0}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-orange-500 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-slate-400">Our blog content is currently being generated.</p>
          </div>
        )}
      </div>
    </div>
  );
}
