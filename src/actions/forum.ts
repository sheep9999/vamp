// src/actions/forum.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(20, "Content must be at least 20 characters").max(10000),
  category: z.enum(["GENERAL", "VIBE_CHECKS", "SHOW_TELL", "TECHNICAL"]),
});

export type ThreadFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  threadId?: string;
};

export async function createThread(
  prevState: ThreadFormState | null,
  formData: FormData
): Promise<ThreadFormState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to create a thread",
    };
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
  };

  const validatedFields = createThreadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const thread = await prisma.forumThread.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category as any,
        userId: session.user.id,
      },
    });

    revalidatePath("/forum");

    return {
      success: true,
      message: "Thread created successfully!",
      threadId: thread.id,
    };
  } catch (error) {
    console.error("Error creating thread:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function addThreadReply(
  threadId: string,
  content: string,
  parentId?: string
): Promise<{
  success: boolean;
  message: string;
  reply?: any;
}> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to reply",
    };
  }

  if (!content.trim() || content.length < 2) {
    return {
      success: false,
      message: "Reply must be at least 2 characters",
    };
  }

  try {
    const reply = await prisma.threadReply.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        threadId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true, username: true },
        },
      },
    });

    // Update reply count
    await prisma.forumThread.update({
      where: { id: threadId },
      data: { replyCount: { increment: 1 } },
    });

    revalidatePath(`/forum/${threadId}`);

    return {
      success: true,
      message: "Reply added successfully",
      reply: { ...reply, replies: [] },
    };
  } catch (error) {
    console.error("Error adding reply:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function upvoteThread(threadId: string): Promise<{
  success: boolean;
  upvoted: boolean;
  newCount: number;
  message?: string;
}> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      upvoted: false,
      newCount: 0,
      message: "You must be signed in to upvote",
    };
  }

  try {
    const existingUpvote = await prisma.threadUpvote.findUnique({
      where: {
        userId_threadId: {
          userId: session.user.id,
          threadId,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.threadUpvote.delete({
          where: { id: existingUpvote.id },
        }),
        prisma.forumThread.update({
          where: { id: threadId },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);

      const thread = await prisma.forumThread.findUnique({
        where: { id: threadId },
        select: { upvoteCount: true },
      });

      revalidatePath("/forum");
      revalidatePath(`/forum/${threadId}`);

      return {
        success: true,
        upvoted: false,
        newCount: thread?.upvoteCount ?? 0,
      };
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.threadUpvote.create({
          data: {
            userId: session.user.id,
            threadId,
          },
        }),
        prisma.forumThread.update({
          where: { id: threadId },
          data: { upvoteCount: { increment: 1 } },
        }),
      ]);

      const thread = await prisma.forumThread.findUnique({
        where: { id: threadId },
        select: { upvoteCount: true },
      });

      revalidatePath("/forum");
      revalidatePath(`/forum/${threadId}`);

      return {
        success: true,
        upvoted: true,
        newCount: thread?.upvoteCount ?? 0,
      };
    }
  } catch (error) {
    console.error("Error upvoting thread:", error);
    return {
      success: false,
      upvoted: false,
      newCount: 0,
      message: "Something went wrong",
    };
  }
}
