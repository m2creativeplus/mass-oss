"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Content Generator Specialist Agent
 * Generates professional, SEO-ready blog posts for MASS OSS CMS.
 * Supports Gemini (primary) with OpenAI (fallback).
 */
export const generateBlogPost = action({
  args: {
    prompt: v.string(),
    orgId: v.string(),
  },
  handler: async (_ctx, args) => {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const OPENAI_KEY = process.env.OPENAI_API_KEY;

    const systemPrompt = `You are an expert SEO Content Strategist for MASS OSS — a Garage Management System designed for the Somaliland automotive market.

Your task: Generate a single, complete, high-converting blog post that is ready for immediate CMS publication.

MASS OSS Key Features to reference naturally:
- Vehicle Check (CarCheck integration for full history)
- Technician Dashboard (mobile-first task management)
- Smart Reporting (revenue, KPI, performance trends)
- Customer Portal (transparent online repair tracking)
- AI Auto-Diagnostics (OBD-II code analysis, TSB lookup)

Local Context (always use at least two):
- Cities: Hargeisa, Berbera, Burao, Gabiley, Borama, Erigavo
- Vehicles: Toyota Hilux, Vitz, Prado, Land Cruiser; Suzuki Every, Vitara
- Market: Mechanics working with intermittent power/internet; most customers pay cash (Zaad/Edahab)

CTAs to include:
- "Register Your Workshop on MASS OSS"
- "Try MASS OSS Today — Free Trial"
- "Check Your Vehicle History at CarCheck"

Return ONLY a JSON object (no markdown wrapper) with these exact fields:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...(155-175 chars)...",
  "content": "...(full markdown, 900-1200 words, H2/H3/bullets/bold)...",
  "tags": ["...", "...", "..."],
  "metaTitle": "...(55-60 chars)...",
  "metaDescription": "...(155-175 chars)...",
  "seoKeywords": ["...", "..."],
  "internalLinks": ["/features/vehicle-check", "/features/technician-dashboard", "/blog/..."]
}`;

    const userPrompt = `Blog topic: "${args.prompt}"\n\nWrite a complete, professional, SEO-optimized blog post for the MASS OSS CMS. Make it specific to the Somaliland automotive industry context.`;

    // --- Try Gemini First ---
    if (GEMINI_KEY) {
      try {
        const geminiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
              },
            }),
          }
        );
        if (geminiResp.ok) {
          const geminiData = await geminiResp.json();
          const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) return JSON.parse(raw);
        }
      } catch (e) {
        console.error("[Gemini Error]", e);
      }
    }

    // --- Fallback: OpenAI ---
    if (OPENAI_KEY) {
      try {
        const oaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2048,
          }),
        });
        if (oaiResp.ok) {
          const oaiData = await oaiResp.json();
          const raw = oaiData?.choices?.[0]?.message?.content;
          if (raw) return JSON.parse(raw);
        }
      } catch (e) {
        console.error("[OpenAI Error]", e);
      }
    }

    // --- Offline Fallback (no API key configured) ---
    console.warn("[AI Content Agent] No API key found — returning structured mock draft.");
    const slug = args.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return {
      title: `${args.prompt} — A Complete Guide for Somaliland Workshops`,
      slug: `${slug}-${Date.now().toString(36)}`,
      excerpt: `Discover how MASS OSS helps Somaliland workshops implement ${args.prompt} to improve efficiency, customer satisfaction, and revenue.`,
      content: `## Understanding ${args.prompt} in Somaliland Auto Workshops\n\nWorkshops in Hargeisa and Berbera face a unique challenge: growing customer demand with limited digital infrastructure. **${args.prompt}** represents a turning point for forward-thinking garage owners.\n\n### The Current State of Auto Workshops in Somaliland\n\nMost workshops still rely on paper notebooks for job cards, phone calls for status updates, and manual ledgers for invoicing. This creates friction at every stage of the repair lifecycle.\n\n### How MASS OSS Solves This\n\nMAXS OSS provides an end-to-end **Garage Management System** specifically designed for the Somaliland context:\n\n- **Technician Dashboard**: Mechanics see their assigned jobs instantly on a mobile-optimized screen.\n- **CarCheck Integration**: Pull complete vehicle history before the first wrench turns.\n- **Smart Reporting**: Track daily revenue, parts consumption, and technician performance in real time.\n\n### Step-by-Step: Getting Started\n\n1. Register your workshop at mass-oss.com\n2. Add your vehicle fleet and customer database\n3. Create your first digital job card\n4. Share real-time updates via the Customer Portal\n\n### The Business Impact\n\nWorkshops that adopt digital systems report:\n- **30% reduction** in repeat repair errors\n- **25% faster** job turnaround time\n- **Stronger customer loyalty** through transparent communication\n\n---\n\n**[Register Your Workshop on MASS OSS Today →]**\n\n---\n\n## Frequently Asked Questions\n\n**Q: Do I need reliable internet to use MASS OSS?**\nA: MASS OSS is optimized for low-bandwidth environments common in Somaliland.\n\n**Q: Can my mechanics use it on phones?**\nA: Yes — the Technician Dashboard is fully mobile-optimized.\n\n**Q: How are payments handled?**\nA: MASS OSS supports Zaad, Edahab, cash, and bank transfer recording.\n\n**Q: Is there a free trial?**\nA: Yes. [Try MASS OSS Today — Free Trial →]`,
      tags: ["Somaliland", "workshop management", "MASS OSS", "auto repair"],
      metaTitle: `${args.prompt} | MASS OSS Workshop Guide`,
      metaDescription: `Learn how MASS OSS helps Somaliland workshops implement ${args.prompt}. Real-time diagnostics, job tracking, and customer transparency in one system.`,
      seoKeywords: ["Somaliland auto workshop", "garage management system", "MASS OSS", args.prompt.toLowerCase()],
      internalLinks: ["/features/vehicle-check", "/features/technician-dashboard", "/features/smart-reporting"],
    };
  },
});
