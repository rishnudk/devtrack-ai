"use client";

import { useMemo } from "react";
import Header from "@/components/shared/Header";
import SelectedTopicCard from "@/components/my-topics/SelectedTopicCard";
import { useUserTopics } from "@/hooks/useUserTopics";

export default function MyTopicsPage() {
  const { selectedTopics, loading, removeTopic } = useUserTopics();

  // Group selected topics by category
  const groupedTopics = useMemo(() => {
    const groups: Record<string, { categoryName: string; topics: typeof selectedTopics }> = {};

    for (const topic of selectedTopics) {
      const catId = topic.categoryId;
      const catName = topic.category?.name || "Uncategorized";

      if (!groups[catId]) {
        groups[catId] = { categoryName: catName, topics: [] };
      }
      groups[catId].topics.push(topic);
    }

    return Object.values(groups);
  }, [selectedTopics]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A]">
      <Header
        title="My Learning List"
        description="Your selected topics and progress."
      />

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {/* Stats */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">
            {loading
              ? "FETCHING DATA..."
              : `${selectedTopics.length} TOPIC${selectedTopics.length !== 1 ? "S" : ""} TRACKED`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 border border-neutral-900 bg-[#0F0F0F] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && selectedTopics.length === 0 && (
          <div className="border border-neutral-900 p-24 flex flex-col items-center justify-center text-center mt-12">
            <span className="text-neutral-600 font-mono text-sm uppercase tracking-widest mb-6">
              [ LIST EMPTY ]
            </span>
            <h3 className="text-white font-medium text-2xl mb-4 tracking-tight">
              No topics selected.
            </h3>
            <p className="text-neutral-500 font-light mb-10 max-w-md">
              Browse the catalog to discover topics and add them to your learning list.
            </p>
            <a
              href="/catalog"
              className="border border-white bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-2.5 text-sm font-medium"
            >
              Browse Catalog
            </a>
          </div>
        )}

        {/* Grouped topic cards */}
        {!loading && groupedTopics.length > 0 && (
          <div className="space-y-10">
            {groupedTopics.map((group) => (
              <div key={group.categoryName}>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-neutral-500 font-mono text-xs tracking-widest uppercase">
                    {group.categoryName}
                  </h3>
                  <div className="flex-1 h-px bg-neutral-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.topics.map((topic) => (
                    <div key={topic.id} className="min-h-[220px]">
                      <SelectedTopicCard
                        selectedTopic={topic}
                        onRemove={removeTopic}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
