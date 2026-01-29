// src/actions/projects.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { projectSchema, type ProjectFormData } from "@/lib/validations";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  projectId?: string;
};

export async function createProject(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Check authentication
  const session = await getSession();
  
  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to submit a project",
    };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
    demoUrl: formData.get("demoUrl") as string,
    repoUrl: formData.get("repoUrl") as string,
    techStack: formData.getAll("techStack") as string[],
    category: (formData.get("category") as string) || "OTHER",
  };
  
  const grantId = formData.get("grantId") as string;

  // Validate
  const validatedFields = projectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // Create project in database
    const project = await prisma.project.create({
      data: {
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
        techStack: data.techStack,
        tags: data.techStack.slice(0, 5), // Use first 5 tech stack items as tags
        category: data.category as any,
        status: "PUBLISHED",
        publishedAt: new Date(),
        userId: session.user.id,
      },
    });

    // If a grant was selected, create a grant application
    if (grantId) {
      // Verify grant exists and is open
      const grant = await prisma.grant.findFirst({
        where: {
          id: grantId,
          status: "OPEN",
          OR: [
            { deadline: null },
            { deadline: { gte: new Date() } },
          ],
        },
      });

      if (grant) {
        await prisma.grantApplication.create({
          data: {
            projectId: project.id,
            grantId: grantId,
            status: "PENDING",
          },
        });
        
        // Revalidate grants page
        revalidatePath("/grants");
        revalidatePath(`/grants/${grantId}`);
      }
    }

    // Revalidate the homepage to show new project
    revalidatePath("/");

    return {
      success: true,
      message: grantId 
        ? "Project submitted and grant application created!" 
        : "Project submitted successfully!",
      projectId: project.id,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function upvoteProject(projectId: string): Promise<{
  success: boolean;
  upvoted: boolean;
  newCount: number;
  message?: string;
}> {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      success: false,
      upvoted: false,
      newCount: 0,
      message: "You must be signed in to upvote",
    };
  }

  try {
    // Check if user already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.upvote.delete({
          where: { id: existingUpvote.id },
        }),
        prisma.project.update({
          where: { id: projectId },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { upvoteCount: true },
      });

      revalidatePath("/");

      return {
        success: true,
        upvoted: false,
        newCount: project?.upvoteCount ?? 0,
      };
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.upvote.create({
          data: {
            userId: session.user.id,
            projectId: projectId,
          },
        }),
        prisma.project.update({
          where: { id: projectId },
          data: { upvoteCount: { increment: 1 } },
        }),
      ]);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { upvoteCount: true },
      });

      revalidatePath("/");

      return {
        success: true,
        upvoted: true,
        newCount: project?.upvoteCount ?? 0,
      };
    }
  } catch (error) {
    console.error("Error upvoting project:", error);
    return {
      success: false,
      upvoted: false,
      newCount: 0,
      message: "Something went wrong",
    };
  }
}
