"use client";

import { useState, useEffect, useCallback } from "react";
import { Note } from "@/types";
import { toast } from "sonner";

export function useNotes(topicId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/topics/${topicId}/notes`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      toast.error("Failed to load notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const createNote = async (
    title: string,
    content: string,
    isAiGenerated = false
  ) => {
    const res = await fetch(`/api/topics/${topicId}/notes`, {
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

  const updateNote = async (
    noteId: string,
    data: { title?: string; content?: string }
  ) => {
    const res = await fetch(`/api/topics/${topicId}/notes/${noteId}`, {
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
    const res = await fetch(`/api/topics/${topicId}/notes/${noteId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete note");
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, createNote, updateNote, deleteNote, fetchNotes };
}