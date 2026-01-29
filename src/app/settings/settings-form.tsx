"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile, type ProfileState } from "@/actions/users";
import { Loader2, Save, Check } from "lucide-react";

interface SettingsFormProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    bio: string | null;
    image: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    role: string | null;
  };
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="vamp-btn vamp-btn-primary"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Save Changes
        </>
      )}
    </button>
  );
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [state, formAction] = useFormState<ProfileState | null, FormData>(
    updateProfile,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Success Message */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {state.message}
        </div>
      )}

      {/* Error Message */}
      {state && !state.success && state.message && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.message}
        </div>
      )}

      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-16 h-16 rounded-xl ring-2 ring-[var(--vamp-grey-lighter)]"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-[var(--vamp-orange)] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.name?.charAt(0) || "?"}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm text-[var(--vamp-grey)]">
            Profile picture synced from GitHub
          </p>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-[var(--vamp-black)]">
          Display Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name || ""}
          placeholder="Your name"
          className="vamp-input"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-[var(--vamp-black)]">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vamp-grey-light)]">
            @
          </span>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={user.username || ""}
            placeholder="username"
            className="vamp-input pl-8"
            required
          />
        </div>
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Your profile URL: vamp.dev/{user.username || "username"}
        </p>
        {state?.errors?.username && (
          <p className="text-sm text-red-600">{state.errors.username[0]}</p>
        )}
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium text-[var(--vamp-black)]">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={user.bio || ""}
          placeholder="Tell us about yourself..."
          rows={3}
          className="vamp-input resize-none"
          maxLength={500}
        />
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Max 500 characters
        </p>
        {state?.errors?.bio && (
          <p className="text-sm text-red-600">{state.errors.bio[0]}</p>
        )}
      </div>

      {/* Website Field */}
      <div className="space-y-2">
        <label htmlFor="website" className="block text-sm font-medium text-[var(--vamp-black)]">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          defaultValue={user.website || ""}
          placeholder="https://yoursite.com"
          className="vamp-input"
        />
        {state?.errors?.website && (
          <p className="text-sm text-red-600">{state.errors.website[0]}</p>
        )}
      </div>

      {/* Twitter Field */}
      <div className="space-y-2">
        <label htmlFor="twitter" className="block text-sm font-medium text-[var(--vamp-black)]">
          Twitter / X
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vamp-grey-light)]">
            @
          </span>
          <input
            type="text"
            id="twitter"
            name="twitter"
            defaultValue={user.twitter || ""}
            placeholder="username"
            className="vamp-input pl-8"
          />
        </div>
        {state?.errors?.twitter && (
          <p className="text-sm text-red-600">{state.errors.twitter[0]}</p>
        )}
      </div>

      {/* Role Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--vamp-black)]">
          Role
        </label>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            user.role === "SPONSOR" 
              ? "bg-purple-100 text-purple-700"
              : user.role === "ADMIN"
              ? "bg-blue-100 text-blue-700"
              : "bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]"
          }`}>
            {user.role || "VIBECODER"}
          </span>
          <span className="text-xs text-[var(--vamp-grey-light)]">
            Contact support to change your role
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}
