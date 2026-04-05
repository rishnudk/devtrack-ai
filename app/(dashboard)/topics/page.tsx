"use client";

import Header from "@/components/shared/Header";
import TopicCard from "@/components/topics/TopicCard";
import CreateTopicDialog from "@/components/topics/CreateTopicDialog";
import { useTopics } from "@/hooks/useTopics";

export default function TopicsPage() {
  const { topics, loading, createTopic, deleteTopic } = useTopics();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A]">
      <Header
        title="Knowledge Records"
        description="Active learning subjects and tracking parameters."
      />

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">
            {loading ? "FETCHING DATA..." : `${topics.length} RECORD${topics.length !== 1 ? "S" : ""} ONLINE`}
          </p>
          <CreateTopicDialog onTopicCreated={createTopic} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 border border-neutral-900 bg-[#0F0F0F] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && topics.length === 0 && (
          <div className="border border-neutral-900 p-24 flex flex-col items-center justify-center text-center mt-12">
            <span className="text-neutral-600 font-mono text-sm uppercase tracking-widest mb-6">
              [ DIRECTORY EMPTY ]
            </span>
            <h3 className="text-white font-medium text-2xl mb-4 tracking-tight">
              No records initialized.
            </h3>
            <p className="text-neutral-500 font-light mb-10 max-w-md">
              Create a new knowledge record to begin tracking system progress and generating contextual AI insights.
            </p>
            <CreateTopicDialog onTopicCreated={createTopic} />
          </div>
        )}

        {/* Topics grid */}
        {!loading && topics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div key={topic.id} className="min-h-[220px]">
                <TopicCard
                  topic={topic}
                  onDelete={deleteTopic}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}