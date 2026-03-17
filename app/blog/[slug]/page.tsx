import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Wrench, Calendar, Eye, ArrowLeft, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://artful-jaguar-416.convex.cloud");
  try {
    const post = await convex.query(api.cms.getBlogPostBySlug, { slug }) as any;
    
    if (!post) {
      return { title: 'Post Not Found' };
    }

    return {
      title: `${post.metaTitle || post.title} | MASS OSS Insights`,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
      }
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: 'MASS OSS Insights' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://artful-jaguar-416.convex.cloud");
  let post = null;
  
  try {
    post = await convex.query(api.cms.getBlogPostBySlug, { slug }) as any;
  } catch (error) {
    console.error("Post fetch error during build:", error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden flex flex-col pt-24 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <main className="max-w-4xl mx-auto px-6 w-full relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
        
        <article>
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1.5 text-xs font-semibold bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-slate-300 mb-8 leading-relaxed border-l-4 border-orange-500 pl-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-slate-400 font-medium py-6 border-y border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500" />
                {post.viewCount || 0} Views
              </div>
              <button className="flex items-center gap-2 ml-auto hover:text-white transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </header>

          <div className="prose prose-invert prose-orange max-w-none prose-lg
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-orange-500 hover:prose-a:text-orange-400
            prose-img:rounded-2xl prose-img:border prose-img:border-white/10
            prose-hr:border-white/10 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/5 prose-blockquote:py-1 pr-1
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Call to action */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50" />
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Ready to transform your workshop?</h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
            Join the leading digital platform for Somaliland automotive businesses. Manage repairs, track inventory, and delight customers.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <Link href="/login" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all">
              Try MASS OSS Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
