// src/actions/grants.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { z } from "zod";

// Validation schema for creating a grant
const createGrantSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().optional(),
  deadline: z.date().optional(),
  maxRecipients: z.number().int().positive().default(1),
});

export type GrantFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  grantId?: string;
};

export async function createGrant(
  prevState: GrantFormState | null,
  formData: FormData
): Promise<GrantFormState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
    };
  }

  // Check if user is a sponsor
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "SPONSOR" && user?.role !== "ADMIN") {
    return {
      success: false,
      message: "Only sponsors can create grants",
    };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    description: formData.get("description") as string,
    requirements: formData.get("requirements") as string || undefined,
    deadline: formData.get("deadline") 
      ? new Date(formData.get("deadline") as string) 
      : undefined,
    maxRecipients: parseInt(formData.get("maxRecipients") as string) || 1,
  };

  const validatedFields = createGrantSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const grant = await prisma.grant.create({
      data: {
        title: data.title,
        amount: data.amount,
        description: data.description,
        requirements: data.requirements || null,
        deadline: data.deadline || null,
        maxRecipients: data.maxRecipients,
        status: "OPEN", // Publish immediately
        sponsorId: session.user.id,
      },
    });

    revalidatePath("/grants");
    
    return {
      success: true,
      message: "Grant created successfully!",
      grantId: grant.id,
    };
  } catch (error) {
    console.error("Error creating grant:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function applyToGrant(
  projectId: string,
  grantId: string,
  message?: string
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
    };
  }

  try {
    // Verify the project belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found or you don't have permission",
      };
    }

    // Verify the grant is open
    const grant = await prisma.grant.findFirst({
      where: {
        id: grantId,
        status: "OPEN",
      },
    });

    if (!grant) {
      return {
        success: false,
        message: "Grant is not accepting applications",
      };
    }

    // Check if deadline has passed
    if (grant.deadline && new Date(grant.deadline) < new Date()) {
      return {
        success: false,
        message: "Grant deadline has passed",
      };
    }

    // Check if already applied
    const existingApplication = await prisma.grantApplication.findUnique({
      where: {
        projectId_grantId: {
          projectId,
          grantId,
        },
      },
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied to this grant with this project",
      };
    }

    // Create application
    await prisma.grantApplication.create({
      data: {
        projectId,
        grantId,
        message: message || null,
        status: "PENDING",
      },
    });

    revalidatePath("/grants");
    revalidatePath(`/grants/${grantId}`);

    return {
      success: true,
      message: "Application submitted successfully!",
    };
  } catch (error) {
    console.error("Error applying to grant:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getActiveGrants() {
  return prisma.grant.findMany({
    where: {
      status: "OPEN",
      OR: [
        { deadline: null },
        { deadline: { gte: new Date() } },
      ],
    },
    select: {
      id: true,
      title: true,
      amount: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  grantId: string,
  newStatus: "APPROVED" | "REJECTED" | "REVIEWING"
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
    };
  }

  try {
    // Verify the grant belongs to this sponsor
    const grant = await prisma.grant.findFirst({
      where: {
        id: grantId,
        sponsorId: session.user.id,
      },
    });

    if (!grant) {
      return {
        success: false,
        message: "Grant not found or you don't have permission",
      };
    }

    // Verify the application exists and belongs to this grant
    const application = await prisma.grantApplication.findFirst({
      where: {
        id: applicationId,
        grantId: grantId,
      },
    });

    if (!application) {
      return {
        success: false,
        message: "Application not found",
      };
    }

    // Update the application status
    await prisma.grantApplication.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    revalidatePath(`/dashboard/grants/${grantId}`);
    revalidatePath(`/grants/${grantId}`);

    const statusMessages = {
      APPROVED: "Application approved successfully!",
      REJECTED: "Application rejected.",
      REVIEWING: "Application marked as under review.",
    };

    return {
      success: true,
      message: statusMessages[newStatus],
    };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
