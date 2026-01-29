// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProjects = [
  {
    title: "VoiceFlow AI",
    tagline: "Convert any text to natural-sounding speech with AI voices in 50+ languages",
    description: `Built this in a weekend using Claude and Cursor! VoiceFlow AI lets you convert any text into realistic speech using state-of-the-art AI models.

## Features
- 50+ language support
- Multiple voice styles (casual, professional, storytelling)
- Real-time preview
- API access for developers

## Tech Stack
Built with Next.js, deployed on Vercel. The AI voice synthesis runs on a custom fine-tuned model.

Vibecoded this entire thing in about 8 hours with Claude helping me architect the system and write the tricky audio processing code.`,
    demoUrl: "https://voiceflow-demo.vercel.app",
    repoUrl: "https://github.com/example/voiceflow-ai",
    techStack: ["claude", "cursor", "nextjs", "typescript", "vercel"],
    upvoteCount: 247,
  },
  {
    title: "PixelMind",
    tagline: "AI-powered image editor that understands natural language commands",
    description: `Tired of complex Photoshop menus? Just tell PixelMind what you want!

"Remove the background", "Make it more vibrant", "Add a sunset glow" - PixelMind understands and executes.

Built using v0 for the UI components and Claude for the NLP processing pipeline. The whole project took 3 days from idea to launch.`,
    demoUrl: "https://pixelmind.app",
    repoUrl: "https://github.com/example/pixelmind",
    techStack: ["v0", "claude", "react", "tailwind", "supabase"],
    upvoteCount: 189,
  },
  {
    title: "CodeReview Bot",
    tagline: "Automated PR reviews that actually understand your codebase context",
    description: `This bot integrates with GitHub and provides intelligent code reviews that understand your project's patterns and conventions.

Unlike generic linters, CodeReview Bot learns from your existing codebase and provides contextual suggestions.

Built the MVP in a single day using Cursor's composer feature. The hardest part was the GitHub webhook integration, but Claude helped me debug the auth flow.`,
    demoUrl: null,
    repoUrl: "https://github.com/example/codereview-bot",
    techStack: ["cursor", "claude", "typescript", "prisma", "nextjs"],
    upvoteCount: 156,
  },
  {
    title: "Meal Planner Pro",
    tagline: "AI nutritionist that creates personalized weekly meal plans based on your goals",
    description: `Enter your dietary preferences, fitness goals, and budget - get a complete weekly meal plan with recipes and shopping lists.

The AI considers nutritional balance, prep time, ingredient overlap (to reduce waste), and even local grocery prices.

Vibecoded with Replit and Claude. Used Replit's AI features for quick iteration and Claude for the complex meal optimization algorithm.`,
    demoUrl: "https://mealplanner.pro",
    repoUrl: "https://github.com/example/meal-planner",
    techStack: ["replit", "claude", "react", "supabase"],
    upvoteCount: 134,
  },
  {
    title: "GitStory",
    tagline: "Turn your git history into beautiful visual stories of your project's evolution",
    description: `Every project has a story. GitStory visualizes your commit history as an interactive timeline showing how your project evolved.

Features:
- Beautiful commit visualizations
- Contributor spotlights
- Milestone detection
- Shareable project stories

Perfect for READMEs, portfolios, or just appreciating how far your project has come!`,
    demoUrl: "https://gitstory.dev",
    repoUrl: "https://github.com/example/gitstory",
    techStack: ["bolt", "claude", "nextjs", "typescript", "tailwind"],
    upvoteCount: 98,
  },
  {
    title: "StudyBuddy",
    tagline: "AI tutor that adapts to your learning style and explains concepts in ways you understand",
    description: `StudyBuddy is like having a patient tutor available 24/7. It remembers what you've learned, identifies knowledge gaps, and adjusts explanations based on your level.

Key features:
- Socratic questioning method
- Visual/auditory/reading preference detection  
- Spaced repetition scheduling
- Progress tracking

Built for my own studying needs but launched it for everyone. Vibecoded the entire backend in one afternoon!`,
    demoUrl: "https://studybuddy.ai",
    repoUrl: null,
    techStack: ["chatgpt", "cursor", "nextjs", "prisma", "vercel"],
    upvoteCount: 87,
  },
];

const sampleGrants = [
  {
    title: "AI Developer Tools Grant",
    description: `We're looking to fund innovative developer tools built with AI assistance.

This grant is for projects that help other developers be more productive - think IDE extensions, CLI tools, code generators, documentation helpers, and more.

**What we're looking for:**
- Tools that solve real developer pain points
- Creative use of AI in the development workflow
- Projects with potential for wide adoption

Winners will receive funding plus mentorship from our team of senior engineers.`,
    amount: 2500,
    requirements: `- Project must be open source
- Must use at least one AI coding assistant in development
- Working demo or MVP required
- Solo developers or teams up to 3 people`,
    maxRecipients: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    title: "Student Builder Scholarship",
    description: `Supporting the next generation of vibeccoders! This scholarship is exclusively for students building projects with AI assistance.

Whether you're learning to code or building your capstone project, we want to support your journey. No experience level required - just passion and creativity.

Projects in any category welcome: web apps, mobile apps, games, utilities, and more!`,
    amount: 500,
    requirements: `- Must be currently enrolled as a student
- First-time project submissions welcome
- Project must be your own work (AI-assisted is encouraged!)
- Include a short video demo (2-3 minutes)`,
    maxRecipients: 10,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
  },
  {
    title: "Open Source Accelerator",
    description: `Funding for impactful open source projects in the AI-assisted development space.

We believe in the power of open source to democratize access to AI tools. This grant supports maintainers and contributors building tools that benefit the entire community.

Priority given to projects with existing traction and clear roadmaps for future development.`,
    amount: 5000,
    requirements: `- Project must be fully open source (MIT, Apache, or similar license)
- Must have at least 10 GitHub stars or equivalent traction
- Clear documentation and contribution guidelines
- Roadmap for future development`,
    maxRecipients: 2,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
  },
  {
    title: "Weekend Hackathon Prize",
    description: `Built something amazing in a weekend? This rolling grant rewards the most impressive quick builds submitted each month.

We love seeing what's possible when talented builders focus intensely on a problem. Show us your weekend projects - rough edges are okay!

No formal application needed - just submit your project and tag it for this grant.`,
    amount: 750,
    requirements: `- Project must be completable in 48 hours or less
- Include build log or thread documenting your process
- Share your AI prompts and workflow
- Any tech stack welcome`,
    maxRecipients: 4,
    deadline: null, // Rolling applications
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create a demo vibecoder user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@vamp.dev" },
    update: {},
    create: {
      email: "demo@vamp.dev",
      name: "Demo Vibecoder",
      username: "demovibe",
      role: "VIBECODER",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
      bio: "Building cool stuff with AI ⚡",
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Create a demo sponsor user
  const sponsorUser = await prisma.user.upsert({
    where: { email: "sponsor@vamp.dev" },
    update: {},
    create: {
      email: "sponsor@vamp.dev",
      name: "VAMP Foundation",
      username: "vampfund",
      role: "SPONSOR",
      image: "https://avatars.githubusercontent.com/u/2?v=4",
      bio: "Supporting the vibecoding community with grants and resources 💰",
      website: "https://vamp.dev",
    },
  });

  console.log(`✅ Created sponsor user: ${sponsorUser.email}`);

  // Create sample projects
  for (const projectData of sampleProjects) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        tags: projectData.techStack.slice(0, 5),
        status: "PUBLISHED",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Random time in last 7 days
        ),
        userId: demoUser.id,
      },
    });
    console.log(`✅ Created project: ${project.title}`);
  }

  // Create sample grants
  for (const grantData of sampleGrants) {
    const grant = await prisma.grant.create({
      data: {
        ...grantData,
        status: "OPEN",
        sponsorId: sponsorUser.id,
      },
    });
    console.log(`✅ Created grant: ${grant.title} ($${grantData.amount})`);
  }

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
