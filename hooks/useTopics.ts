"use client";

import { useState, useEffect, useCallback } from "react";
import { Topic } from "@/types";
import { toast } from "sonner";

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    try {
      const res = await fetch("/api/topics");
      if (!res.ok) throw new Error("Failed to fetch topics");
      const data = await res.json();
      setTopics(data);
    } catch (error) {
      toast.error("Failed to load topics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = async (name: string, description?: string) => {
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create topic");
    }

    const newTopic = await res.json();
    setTopics((prev) => [...prev, newTopic]);
    return newTopic;
  };

  const deleteTopic = async (topicId: string) => {
    const res = await fetch(`/api/topics/${topicId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete topic");
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  };

  const updateTopic = async (topicId: string, data: Partial<Topic>) => {
    const res = await fetch(`/api/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update topic");
    const updated = await res.json();
    setTopics((prev) => prev.map((t) => (t.id === topicId ? updated : t)));
    return updated;
  };

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, createTopic, deleteTopic, updateTopic, fetchTopics };
}