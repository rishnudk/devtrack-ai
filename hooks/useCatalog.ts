"use client";

import { useState, useEffect, useCallback } from "react";
import { catalogCategory } from "@/types";
import { toast } from "sonner";

export function useCatalog() {
  const [categories, setCategories] = useState<catalogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      if (!res.ok) throw new Error("Failed to fetch catalog");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load catalog");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (name: string, description?: string, icon?: string) => {
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add category");
    }

    const newCategory = await res.json();
    // Refetch to get the full nested structure
    await fetchCatalog();
    return newCategory;
  };

  const deleteCategory = async (categoryId: string) => {
    const res = await fetch(`/api/catalog/${categoryId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete category");
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const addSubtopic = async (categoryId: string, name: string, description?: string) => {
    const res = await fetch(`/api/catalog/${categoryId}/subtopics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add subtopic");
    }

    const newSubtopic = await res.json();
    await fetchCatalog();
    return newSubtopic;
  };

  const deleteSubtopic = async (categoryId: string, subtopicId: string) => {
    const res = await fetch(`/api/catalog/${categoryId}/subtopics/${subtopicId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete subtopic");
    await fetchCatalog();
  };

  const addConcept = async (categoryId: string, subtopicId: string, name: string, description?: string) => {
    const res = await fetch(`/api/catalog/${categoryId}/subtopics/${subtopicId}/concepts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add concept");
    }

    const newConcept = await res.json();
    await fetchCatalog();
    return newConcept;
  };

  const deleteConcept = async (categoryId: string, subtopicId: string, conceptId: string) => {
    const res = await fetch(`/api/catalog/${categoryId}/subtopics/${subtopicId}/concepts/${conceptId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete concept");
    await fetchCatalog();
  };

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return {
    categories,
    loading,
    addCategory,
    deleteCategory,
    addSubtopic,
    deleteSubtopic,
    addConcept,
    deleteConcept,
    fetchCatalog,
  };
}
