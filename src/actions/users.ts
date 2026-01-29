// src/actions/users.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const roleSchema = z.enum(["VIBECODER", "SPONSOR"]);

export type OnboardingState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function setUserRole(
  prevState: OnboardingState | null,
  formData: FormData
): Promise<OnboardingState> {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
      error: "Unauthorized",
    };
  }

  const role = formData.get("role") as string;
  
  const validatedRole = roleSchema.safeParse(role);
  
  if (!validatedRole.success) {
    return {
      success: false,
      message: "Please select a valid role",
      error: "Invalid role",
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: validatedRole.data },
    });

    revalidatePath("/");
    
    return {
      success: true,
      message: "Role set successfully!",
    };
  } catch (error) {
    console.error("Error setting user role:", error);
    return {
      success: false,
      message: "Something went wrong",
      error: "Database error",
    };
  }
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().max(50).optional().or(z.literal("")),
});

export type ProfileState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateProfile(
  prevState: ProfileState | null,
  formData: FormData
): Promise<ProfileState> {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in",
    };
  }

  const rawData = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
    website: formData.get("website") as string,
    twitter: formData.get("twitter") as string,
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // Check if username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: { id: session.user.id },
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username is already taken",
        errors: { username: ["This username is already taken"] },
      };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio || null,
        website: data.website || null,
        twitter: data.twitter || null,
      },
    });

    revalidatePath(`/${data.username}`);
    revalidatePath("/settings");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
