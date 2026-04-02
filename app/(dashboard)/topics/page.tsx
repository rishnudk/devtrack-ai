"use client";

import Header from "@/components/shared/Header";
import TopicCard from "@/components/topics/TopicCard";
import CreateTopicDialog from "@/components/topics/CreateTopicDialog";
import { useTopics } from "@/hooks/useTopics";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function TopicsPage() {
  const { topics, loading, createTopic, deleteTopic } = useTopics();

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Topics"
        description="Manage your learning topics"
      />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            {loading ? "Loading..." : `${topics.length} topic${topics.length !== 1 ? "s" : ""}`}
          </p>
          <CreateTopicDialog onTopicCreated={createTopic} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 bg-card rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 bg-primary text-primary-foreground/10 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No topics yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Create your first topic to start tracking what you&apos;re learning.
            </p>
            <CreateTopicDialog onTopicCreated={createTopic} />
          </div>
        )}

        {/* Topics grid */}
        {!loading && topics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onDelete={deleteTopic}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}