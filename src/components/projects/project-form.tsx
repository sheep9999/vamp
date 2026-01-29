"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createProject, type ActionState } from "@/actions/projects";
import { VIBE_TOOLS, TOOL_CATEGORIES, PROJECT_CATEGORIES } from "@/lib/validations";
import {
  Loader2,
  Send,
  Link as LinkIcon,
  Github,
  FileText,
  Sparkles,
  X,
  Check,
  ChevronDown,
  Gift,
  Layers,
} from "lucide-react";

interface Grant {
  id: string;
  title: string;
  amount: number;
}

interface ProjectFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  grants?: Grant[];
}

// Submit button component that uses useFormStatus
function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full vamp-btn vamp-btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          Submit Project
        </>
      )}
    </button>
  );
}

export function ProjectForm({ user, grants }: ProjectFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGrantId = searchParams.get("grant");
  
  // Ensure grants is always an array
  const availableGrants = grants ?? [];
  
  const [state, formAction] = useFormState<ActionState | null, FormData>(
    createProject,
    null
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [selectedGrantId, setSelectedGrantId] = useState<string>(preselectedGrantId || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("OTHER");

  // Debug log on client
  useEffect(() => {
    console.log("[ProjectForm] Received grants:", availableGrants);
  }, [availableGrants]);

  // Redirect on success
  useEffect(() => {
    if (state?.success && state?.projectId) {
      router.push(`/?submitted=true`);
    }
  }, [state, router]);

  const toggleTool = (value: string) => {
    setSelectedTools((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  };

  const removeTool = (value: string) => {
    setSelectedTools((prev) => prev.filter((t) => t !== value));
  };

  const getToolLabel = (value: string) => {
    return VIBE_TOOLS.find((t) => t.value === value)?.label ?? value;
  };

  const groupedTools = TOOL_CATEGORIES.map((category) => ({
    category,
    tools: VIBE_TOOLS.filter((tool) => tool.category === category),
  })).filter((group) => group.tools.length > 0);

  const selectedGrant = availableGrants.find(g => g.id === selectedGrantId);

  return (
    <form action={formAction} className="space-y-6">
      {/* Global Error Message */}
      {state && !state.success && state.message && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.message}
        </div>
      )}

      {/* Success Message */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {state.message}
        </div>
      )}

      {/* Title Field */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-[var(--vamp-black)]">
          Project Title <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="My Awesome AI Project"
          className="vamp-input"
          required
          maxLength={100}
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Tagline Field */}
      <div className="space-y-2">
        <label htmlFor="tagline" className="block text-sm font-medium text-[var(--vamp-black)]">
          Tagline <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <input
          type="text"
          id="tagline"
          name="tagline"
          placeholder="A short, catchy description of what your project does"
          className="vamp-input"
          required
          maxLength={140}
        />
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Max 140 characters. Make it punchy!
        </p>
        {state?.errors?.tagline && (
          <p className="text-sm text-red-600">{state.errors.tagline[0]}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-[var(--vamp-black)]">
          Description <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--vamp-grey-light)]" />
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about your project. What problem does it solve? How did you build it? What AI tools did you use?"
            className="vamp-input pl-10 min-h-[160px] resize-y"
            required
            maxLength={5000}
          />
        </div>
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Min 50 characters. Markdown supported.
        </p>
        {state?.errors?.description && (
          <p className="text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      {/* URLs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Demo URL */}
        <div className="space-y-2">
          <label htmlFor="demoUrl" className="block text-sm font-medium text-[var(--vamp-black)]">
            Demo URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              placeholder="https://myproject.com"
              className="vamp-input pl-10"
            />
          </div>
          {state?.errors?.demoUrl && (
            <p className="text-sm text-red-600">{state.errors.demoUrl[0]}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <label htmlFor="repoUrl" className="block text-sm font-medium text-[var(--vamp-black)]">
            GitHub Repository
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
            <input
              type="url"
              id="repoUrl"
              name="repoUrl"
              placeholder="https://github.com/user/repo"
              className="vamp-input pl-10"
            />
          </div>
          {state?.errors?.repoUrl && (
            <p className="text-sm text-red-600">{state.errors.repoUrl[0]}</p>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-[var(--vamp-black)]">
          Category <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        
        <input type="hidden" name="category" value={selectedCategory} />
        
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="vamp-input pl-10 pr-10 appearance-none cursor-pointer"
          >
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)] pointer-events-none" />
        </div>
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Choose the category that best describes your project
        </p>
      </div>

      {/* Vibe Tools Multi-Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--vamp-black)]">
          Vibe Tools Used <span className="text-[var(--vamp-orange)]">*</span>
        </label>
        
        {/* Hidden inputs for form submission */}
        {selectedTools.map((tool) => (
          <input key={tool} type="hidden" name="techStack" value={tool} />
        ))}

        {/* Selected Tools Display */}
        {selectedTools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--vamp-orange)] text-white text-sm font-medium"
              >
                {getToolLabel(tool)}
                <button
                  type="button"
                  onClick={() => removeTool(tool)}
                  className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[var(--vamp-grey-lighter)] bg-white/70 text-left hover:border-[var(--vamp-orange)] transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-[var(--vamp-grey)]">
            <Sparkles className="w-4 h-4" />
            {selectedTools.length === 0
              ? "Select the AI tools and tech you used..."
              : `${selectedTools.length} tool${selectedTools.length > 1 ? "s" : ""} selected`}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[var(--vamp-grey)] transition-transform ${
              isToolsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Panel */}
        {isToolsOpen && (
          <div className="mt-2 p-4 rounded-lg border border-[var(--vamp-grey-lighter)] bg-white shadow-lg max-h-[300px] overflow-y-auto">
            {groupedTools.map((group) => (
              <div key={group.category} className="mb-4 last:mb-0">
                <h4 className="text-xs font-semibold text-[var(--vamp-grey)] uppercase tracking-wider mb-2">
                  {group.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => {
                    const isSelected = selectedTools.includes(tool.value);
                    return (
                      <button
                        key={tool.value}
                        type="button"
                        onClick={() => toggleTool(tool.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-[var(--vamp-orange)] text-white"
                            : "bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-orange-10)] hover:text-[var(--vamp-orange)]"
                        }`}
                      >
                        {tool.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {state?.errors?.techStack && (
          <p className="text-sm text-red-600">{state.errors.techStack[0]}</p>
        )}
      </div>

      {/* Grant Application (Always visible) */}
      <div className="space-y-2">
        <label htmlFor="grantId" className="block text-sm font-medium text-[var(--vamp-black)]">
          Apply for a Grant <span className="text-[var(--vamp-grey-light)]">(optional)</span>
        </label>
        
        <input type="hidden" name="grantId" value={selectedGrantId} />
        
        <div className="relative">
          <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
          <select
            id="grantId"
            value={selectedGrantId}
            onChange={(e) => setSelectedGrantId(e.target.value)}
            className="vamp-input pl-10 pr-10 appearance-none cursor-pointer"
            disabled={availableGrants.length === 0}
          >
            {availableGrants.length === 0 ? (
              <option value="">No active grants available</option>
            ) : (
              <>
                <option value="">Don't apply for a grant</option>
                {availableGrants.map((grant) => (
                  <option key={grant.id} value={grant.id}>
                    {grant.title} (${grant.amount.toLocaleString()})
                  </option>
                ))}
              </>
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)] pointer-events-none" />
        </div>
        
        {/* Grants count info */}
        {availableGrants.length > 0 && (
          <p className="text-xs text-[var(--vamp-grey-light)]">
            {availableGrants.length} active grant{availableGrants.length !== 1 ? 's' : ''} available
          </p>
        )}
        
        {/* Selected Grant Info */}
        {selectedGrant && (
          <div className="p-3 rounded-lg bg-[var(--vamp-orange-10)] border border-[var(--vamp-orange-20)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[var(--vamp-orange)]" />
                <span className="text-sm font-medium text-[var(--vamp-black)]">
                  {selectedGrant.title}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[var(--vamp-orange)] text-white text-sm font-bold">
                ${selectedGrant.amount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[var(--vamp-grey)] mt-1">
              Your project will be submitted as an application for this grant.
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <SubmitButton disabled={selectedTools.length === 0} />
      </div>
    </form>
  );
}
