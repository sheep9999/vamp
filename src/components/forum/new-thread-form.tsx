"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createThread, type ThreadFormState } from "@/actions/forum";
import { Loader2, Send, MessageSquare, Sparkles, HelpCircle, Megaphone, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: "GENERAL", label: "General Discussion", icon: MessageSquare, description: "General topics" },
  { value: "VIBE_CHECKS", label: "Vibe Checks", icon: Sparkles, description: "Get feedback on your vibe" },
  { value: "SHOW_TELL", label: "Show & Tell", icon: Megaphone, description: "Show off your work" },
  { value: "TECHNICAL", label: "Technical Help", icon: HelpCircle, description: "Get help with issues" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full vamp-btn vamp-btn-primary py-3 text-base"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Creating Thread...
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          Post Thread
        </>
      )}
    </button>
  );
}

export function NewThreadForm() {
  const router = useRouter();
  const [state, formAction] = useFormState<ThreadFormState | null, FormData>(
    createThread,
    null
  );

  useEffect(() => {
    if (state?.success && state?.threadId) {
      router.push(`/forum/${state.threadId}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Error Message */}
      {state && !state.success && state.message && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.message}
        </div>
      )}

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-[var(--vamp-black)]">
          Category <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            className="vamp-input pr-10 appearance-none cursor-pointer"
            defaultValue="GENERAL"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label} - {cat.description}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)] pointer-events-none" />
        </div>
        {state?.errors?.category && (
          <p className="text-sm text-red-600">{state.errors.category[0]}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-[var(--vamp-black)]">
          Title <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="What's on your mind?"
          className="vamp-input"
          required
          maxLength={200}
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-[var(--vamp-black)]">
          Content <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          placeholder="Share your thoughts, questions, or ideas..."
          className="vamp-input resize-none"
          required
        />
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Markdown supported. Min 20 characters.
        </p>
        {state?.errors?.content && (
          <p className="text-sm text-red-600">{state.errors.content[0]}</p>
        )}
      </div>

      {/* Submit */}
      <SubmitButton />
    </form>
  );
}
