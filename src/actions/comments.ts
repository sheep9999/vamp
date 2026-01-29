// src/actions/comments.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function addComment(
  projectId: string,
  text: string,
  parentId?: string
): Promise<{
  success: boolean;
  message: string;
  comment?: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
    replies: any[];
  };
}> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to comment",
    };
  }

  if (!text.trim()) {
    return {
      success: false,
      message: "Comment cannot be empty",
    };
  }

  if (text.length > 1000) {
    return {
      success: false,
      message: "Comment is too long (max 1000 characters)",
    };
  }

  try {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // If it's a reply, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true },
      });

      if (!parentComment) {
        return {
          success: false,
          message: "Parent comment not found",
        };
      }
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        userId: session.user.id,
        projectId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Comment added successfully",
      comment: {
        ...comment,
        replies: [],
      },
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
    };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, projectId: true },
    });

    if (!comment) {
      return {
        success: false,
        message: "Comment not found",
      };
    }

    if (comment.userId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own comments",
      };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/project/${comment.projectId}`);

    return {
      success: true,
      message: "Comment deleted",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
