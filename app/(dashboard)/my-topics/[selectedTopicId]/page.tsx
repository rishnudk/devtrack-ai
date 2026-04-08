"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import NoteCard from "@/components/notes/NoteCard";
import AddNoteForm from "@/components/notes/AddNoteForm";
import TopicProgressControl from "@/components/topics/TopicProgressControl";
import { userSelectedTopic, TopicStatus, Note, Topic } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import GenerateNotesButton from "@/components/notes/GenerateNotesButton";
import QuizModal from "@/components/ai/QuizModal";

const statusConfig = {
  not_started: {
    label: "Not Started",
    className: "bg-slate-700 text-foreground",
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

export default function SelectedTopicDetailPage({
  params,
}: {
  params: Promise<{ selectedTopicId: string }>;
}) {
  const { selectedTopicId } = use(params);
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<userSelectedTopic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  // Fetch the selected topic with enriched data
  const fetchSelectedTopic = useCallback(async () => {
    try {
      const res = await fetch(`/api/user-topics/${selectedTopicId}`);
      if (!res.ok) throw new Error("Topic not found");
      const data = await res.json();

      // Enrich with catalog data
      const catRes = await fetch(`/api/catalog`).then((r) => r.json());

      // Find category and subtopic from catalog
      let category = null;
      let subtopic = null;
      let concept = null;

      for (const cat of catRes) {
        if (cat.id === data.categoryId) {
          category = cat;
          for (const sub of cat.subtopics) {
            if (sub.id === data.subtopicId) {
              subtopic = sub;
              if (data.conceptId) {
                concept = sub.subtopic_notes?.find((c: { id: string }) => c.id === data.conceptId) || sub.concepts?.find((c: { id: string }) => c.id === data.conceptId) || null;
              }
              break;
            }
          }
          break;
        }
      }

      setSelectedTopic({ ...data, category, subtopic, subtopic_note: concept });
    } catch {
      toast.error("Topic not found");
      router.push("/my-topics");
    } finally {
      setTopicLoading(false);
    }
  }, [selectedTopicId, router]);

  // Fetch notes for this selected topic
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/user-topics/${selectedTopicId}/notes`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setNotesLoading(false);
    }
  }, [selectedTopicId]);

  useEffect(() => {
    fetchSelectedTopic();
    fetchNotes();
  }, [fetchSelectedTopic, fetchNotes]);

  const createNote = async (title: string, content: string, isAiGenerated = false) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isAiGenerated }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create note");
    }

    const newNote = await res.json();
    setNotes((prev) => [...prev, newNote]);
    return newNote;
  };

  const updateNote = async (noteId: string, data: { title?: string; content?: string }) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update note");
    const updated = await res.json();
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    return updated;
  };

  const deleteNote = async (noteId: string) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}/notes/${noteId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete note");
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleTopicUpdate = async (data: Partial<Topic>) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update topic");
    const updated = await res.json();
    setSelectedTopic((prev) => prev ? { ...prev, ...updated } : prev);
  };

  const displayName = selectedTopic?.subtopic_note?.name || selectedTopic?.subtopic?.name || "Topic";
  const breadcrumb = [
    selectedTopic?.category?.name,
    selectedTopic?.subtopic?.name,
    selectedTopic?.subtopic_note?.name,
  ].filter(Boolean).join(" › ");

  const status = selectedTopic ? statusConfig[selectedTopic.status as keyof typeof statusConfig] : null;

  // Create a topic-like object for TopicProgressControl
  const topicLike = selectedTopic
    ? {
        id: selectedTopic.id,
        userId: selectedTopic.userId,
        name: displayName,
        description: breadcrumb,
        status: selectedTopic.status as TopicStatus,
        progress: selectedTopic.progress,
        createdAt: new Date(selectedTopic.createdAt),
        updatedAt: new Date(selectedTopic.updatedAt),
      }
    : null;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={displayName}
        description={breadcrumb}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Back */}
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-white -ml-2"
          onClick={() => router.push("/my-topics")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Topics
        </Button>

        {topicLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-24 bg-card rounded-lg" />
            </div>
            <Skeleton className="h-48 bg-card rounded-lg" />
          </div>
        ) : selectedTopic && topicLike ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — notes */}
            <div className="lg:col-span-2 space-y-4">
              {/* Topic info bar */}
              <div className="bg-card border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-white font-semibold text-lg">
                      {displayName}
                    </h2>
                    {status && (
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {selectedTopic.progress}% complete
                  </span>
                </div>

                <p className="text-muted-foreground text-sm font-mono">{breadcrumb}</p>

                <Progress
                  value={selectedTopic.progress}
                  className="h-1.5 bg-card"
                />
              </div>

              {/* Notes section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Notes
                    <span className="text-muted-foreground font-normal text-sm">
                      ({notes.length})
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <GenerateNotesButton
                      topicName={displayName}
                      onGenerated={createNote}
                    />
                    <QuizModal
                      topicName={displayName}
                      notes={notes}
                    />
                  </div>
                </div>

                <AddNoteForm onNoteCreated={createNote} />

                {notesLoading && (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-32 bg-card rounded-lg" />
                    ))}
                  </div>
                )}

                {!notesLoading && notes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-800 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 text-slate-600 mb-3" />
                    <p className="text-muted-foreground text-sm">No notes yet</p>
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
                topic={topicLike}
                onUpdate={handleTopicUpdate}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
