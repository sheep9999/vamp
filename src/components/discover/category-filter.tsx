"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ArrowUpDown } from "lucide-react";

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  sortBy: string;
}

export function CategoryFilter({ categories, selected, sortBy }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || value === "trending") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[var(--vamp-grey)]" />
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => updateFilter("category", category.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selected === category.value
                ? "bg-[var(--vamp-orange)] text-white"
                : "bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-orange-10)] hover:text-[var(--vamp-orange)]"
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-[var(--vamp-grey)]" />
        <span className="text-sm text-[var(--vamp-grey)]">Sort by:</span>
        <div className="flex gap-1">
          {[
            { value: "trending", label: "Trending" },
            { value: "newest", label: "Newest" },
            { value: "mostUpvoted", label: "Most Upvoted" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                sortBy === option.value
                  ? "bg-[var(--vamp-black)] text-white"
                  : "text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
