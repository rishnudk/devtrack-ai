"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import NoteCard from "@/components/notes/NoteCard";
import AddNoteForm from "@/components/notes/AddNoteForm";
import TopicProgressControl from "@/components/topics/TopicProgressControl";
import { useNotes } from "@/hooks/useNotes";
import { Topic } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  not_started: {
    label: "Not Started",
    className: "bg-slate-700 text-slate-300",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-yellow-500/20 text-yellow-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/20 text-green-400",
  },
};

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const { notes, loading: notesLoading, createNote, updateNote, deleteNote } =
    useNotes(topicId);

  const fetchTopic = useCallback(async () => {
    try {
      const res = await fetch(`/api/topics/${topicId}`);
      if (!res.ok) throw new Error("Topic not found");
      const data = await res.json();
      setTopic(data);
    } catch {
      toast.error("Topic not found");
      router.push("/topics");
    } finally {
      setTopicLoading(false);
    }
  }, [topicId, router]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleTopicUpdate = async (data: Partial<Topic>) => {
    const res = await fetch(`/api/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update topic");
    const updated = await res.json();
    setTopic(updated);
  };

  const status = topic ? statusConfig[topic.status] : null;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={topic?.name ?? "Topic"}
        description={topic?.description ?? "Manage your notes"}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Back */}
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white -ml-2"
          onClick={() => router.push("/topics")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Topics
        </Button>

        {topicLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-24 bg-slate-800 rounded-lg" />
            </div>
            <Skeleton className="h-48 bg-slate-800 rounded-lg" />
          </div>
        ) : topic ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — notes */}
            <div className="lg:col-span-2 space-y-4">
              {/* Topic info bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-white font-semibold text-lg">
                      {topic.name}
                    </h2>
                    {status && (
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    )}
                  </div>
                  <span className="text-slate-400 text-sm">
                    {topic.progress}% complete
                  </span>
                </div>

                {topic.description && (
                  <p className="text-slate-400 text-sm">{topic.description}</p>
                )}

                <Progress
                  value={topic.progress}
                  className="h-1.5 bg-slate-800"
                />
              </div>

              {/* Notes section */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Notes
                  <span className="text-slate-500 font-normal text-sm">
                    ({notes.length})
                  </span>
                </h3>

                <AddNoteForm onNoteCreated={createNote} />

                {notesLoading && (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-32 bg-slate-800 rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {!notesLoading && notes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-800 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 text-slate-600 mb-3" />
                    <p className="text-slate-400 text-sm">No notes yet</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Add your first note above
                    </p>
                  </div>
                )}

                {!notesLoading && notes.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={deleteNote}
                        onUpdate={updateNote}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — progress control */}
            <div className="space-y-4">
              <TopicProgressControl
                topic={topic}
                onUpdate={handleTopicUpdate}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}