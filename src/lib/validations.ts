// src/lib/validations.ts
import { z } from "zod";

export const PROJECT_CATEGORIES = [
  { value: "ENGINEERING", label: "Engineering", icon: "⚙️" },
  { value: "LLMS", label: "LLMs", icon: "🤖" },
  { value: "PRODUCTIVITY", label: "Productivity", icon: "📈" },
  { value: "MARKETING", label: "Marketing & Sales", icon: "📣" },
  { value: "DESIGN", label: "Design", icon: "🎨" },
  { value: "SOCIAL", label: "Social", icon: "👥" },
  { value: "FINANCE", label: "Finance", icon: "💰" },
  { value: "AI_AGENTS", label: "AI Agents", icon: "🤖" },
  { value: "OTHER", label: "Other", icon: "✨" },
] as const;

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(140, "Tagline must be less than 140 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be less than 5000 characters"),
  demoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  repoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  techStack: z
    .array(z.string())
    .min(1, "Select at least one vibe tool"),
  category: z
    .enum(["ENGINEERING", "LLMS", "PRODUCTIVITY", "MARKETING", "DESIGN", "SOCIAL", "FINANCE", "AI_AGENTS", "OTHER"])
    .optional()
    .default("OTHER"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Available vibe tools for the multi-select
export const VIBE_TOOLS = [
  { value: "claude", label: "Claude", category: "AI Assistant" },
  { value: "cursor", label: "Cursor", category: "AI IDE" },
  { value: "replit", label: "Replit", category: "Cloud IDE" },
  { value: "v0", label: "v0 by Vercel", category: "AI UI" },
  { value: "bolt", label: "Bolt.new", category: "AI Builder" },
  { value: "copilot", label: "GitHub Copilot", category: "AI Assistant" },
  { value: "chatgpt", label: "ChatGPT", category: "AI Assistant" },
  { value: "gemini", label: "Gemini", category: "AI Assistant" },
  { value: "windsurf", label: "Windsurf", category: "AI IDE" },
  { value: "lovable", label: "Lovable", category: "AI Builder" },
  { value: "aider", label: "Aider", category: "AI Coding" },
  { value: "cline", label: "Cline", category: "AI Coding" },
  { value: "devin", label: "Devin", category: "AI Agent" },
  { value: "nextjs", label: "Next.js", category: "Framework" },
  { value: "react", label: "React", category: "Framework" },
  { value: "tailwind", label: "Tailwind CSS", category: "Styling" },
  { value: "typescript", label: "TypeScript", category: "Language" },
  { value: "prisma", label: "Prisma", category: "Database" },
  { value: "supabase", label: "Supabase", category: "Backend" },
  { value: "vercel", label: "Vercel", category: "Deployment" },
] as const;

export const TOOL_CATEGORIES = [
  "AI Assistant",
  "AI IDE", 
  "AI Builder",
  "AI Coding",
  "AI Agent",
  "AI UI",
  "Cloud IDE",
  "Framework",
  "Styling",
  "Language",
  "Database",
  "Backend",
  "Deployment",
] as const;
