"use client";

import { useState, useEffect, useCallback } from "react";
import { userSelectedTopic, TopicStatus } from "@/types";
import { toast } from "sonner";

export function useUserTopics() {
  const [selectedTopics, setSelectedTopics] = useState<userSelectedTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTopics = useCallback(async () => {
    try {
      const res = await fetch("/api/user-topics");
      if (!res.ok) throw new Error("Failed to fetch user topics");
      const data = await res.json();
      setSelectedTopics(data);
    } catch (error) {
      toast.error("Failed to load your topics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectTopic = async (categoryId: string, subtopicId: string, conceptId?: string) => {
    const res = await fetch("/api/user-topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, subtopicId, conceptId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to select topic");
    }

    const newSelection = await res.json();
    await fetchUserTopics();
    return newSelection;
  };

  const removeTopic = async (selectedTopicId: string) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to remove topic");
    setSelectedTopics((prev) => prev.filter((t) => t.id !== selectedTopicId));
  };

  const updateTopic = async (selectedTopicId: string, data: { status?: TopicStatus; progress?: number }) => {
    const res = await fetch(`/api/user-topics/${selectedTopicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update topic");
    const updated = await res.json();
    setSelectedTopics((prev) =>
      prev.map((t) => (t.id === selectedTopicId ? { ...t, ...updated } : t))
    );
    return updated;
  };

  useEffect(() => {
    fetchUserTopics();
  }, [fetchUserTopics]);

  return { selectedTopics, loading, selectTopic, removeTopic, updateTopic, fetchUserTopics };
}
