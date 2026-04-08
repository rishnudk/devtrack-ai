"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/shared/Header";
import CategorySection from "@/components/catalog/CategorySection";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import AddCatalogItemForm from "@/components/catalog/AddCatalogItemForm";
import { useCatalog } from "@/hooks/useCatalog";
import { useUserTopics } from "@/hooks/useUserTopics";
import { toast } from "sonner";
import { catalogCategory } from "@/types";

export default function CatalogPage() {
  const {
    categories,
    loading,
    addCategory,
    deleteCategory,
    addSubtopic,
    deleteSubtopic,
    addConcept,
    deleteConcept,
  } = useCatalog();

  const { selectedTopics, selectTopic } = useUserTopics();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.role === "admin"))
      .catch(() => setIsAdmin(false));
  }, []);

  // Build sets of selected IDs for quick lookup
  const selectedSubtopicIds = useMemo(() => {
    return new Set(selectedTopics.map((t) => t.subtopicId));
  }, [selectedTopics]);

  const selectedConceptIds = useMemo(() => {
    return new Set(
      selectedTopics
        .filter((t) => t.subtopicNoteId)
        .map((t) => t.subtopicNoteId as string)
    );
  }, [selectedTopics]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => {
        const categoryMatch = cat.name.toLowerCase().includes(q);
        const filteredSubtopics = cat.subtopics
          .map((sub) => {
            const subtopicMatch = sub.name.toLowerCase().includes(q);
            const filteredConcepts = sub.subtopic_notes.filter((c) =>
              c.name.toLowerCase().includes(q)
            );

            if (subtopicMatch || filteredConcepts.length > 0) {
              return {
                ...sub,
                subtopic_notes: subtopicMatch ? sub.subtopic_notes : filteredConcepts,
              };
            }
            return null;
          })
          .filter(Boolean) as catalogCategory["subtopics"];

        if (categoryMatch || filteredSubtopics.length > 0) {
          return {
            ...cat,
            subtopics: categoryMatch ? cat.subtopics : filteredSubtopics,
          };
        }
        return null;
      })
      .filter(Boolean) as catalogCategory[];
  }, [categories, searchQuery]);

  const handleSelectSubtopic = async (categoryId: string, subtopicId: string) => {
    try {
      await selectTopic(categoryId, subtopicId);
      toast.success("Added to your list");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already")) {
        toast.error("Already in your list");
      } else {
        toast.error("Failed to add topic");
      }
    }
  };

  const handleSelectConcept = async (categoryId: string, subtopicId: string, conceptId: string) => {
    try {
      await selectTopic(categoryId, subtopicId, conceptId);
      toast.success("Added to your list");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already")) {
        toast.error("Already in your list");
      } else {
        toast.error("Failed to add topic");
      }
    }
  };

  const handleAddCategory = async (name: string, description?: string, icon?: string) => {
    try {
      await addCategory(name, description, icon);
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A]">
      <Header
        title="Topic Catalog"
        description="Browse and discover technologies to learn."
      />

      <main className="flex-1 p-10 max-w-5xl mx-auto w-full">
        {/* Search */}
        <div className="mb-8">
          <CatalogSearch onSearch={handleSearch} />
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">
            {loading
              ? "LOADING CATALOG..."
              : `${filteredCategories.length} CATEGOR${filteredCategories.length !== 1 ? "IES" : "Y"} AVAILABLE`}
          </p>
          {isAdmin && (
            <span className="font-mono text-[10px] text-neutral-700 tracking-widest uppercase border border-neutral-800 px-3 py-1">
              ADMIN MODE
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 border border-neutral-900 bg-[#0F0F0F] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filteredCategories.length === 0 && (
          <div className="border border-neutral-900 p-24 flex flex-col items-center justify-center text-center mt-8">
            <span className="text-neutral-600 font-mono text-sm uppercase tracking-widest mb-6">
              {searchQuery ? "[ NO RESULTS ]" : "[ CATALOG EMPTY ]"}
            </span>
            <h3 className="text-white font-medium text-2xl mb-4 tracking-tight">
              {searchQuery ? "No matching topics found." : "No categories yet."}
            </h3>
            <p className="text-neutral-500 font-light mb-6 max-w-md">
              {searchQuery
                ? "Try a different search term."
                : "The catalog is empty. An admin can add categories, subtopics, and concepts."}
            </p>
          </div>
        )}

        {/* Category list */}
        {!loading && filteredCategories.length > 0 && (
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                selectedSubtopicIds={selectedSubtopicIds}
                selectedConceptIds={selectedConceptIds}
                onSelectSubtopic={handleSelectSubtopic}
                onSelectConcept={handleSelectConcept}
                isAdmin={isAdmin}
                onAddSubtopic={addSubtopic}
                onDeleteCategory={deleteCategory}
                onDeleteSubtopic={deleteSubtopic}
                onAddConcept={addConcept}
                onDeleteConcept={deleteConcept}
              />
            ))}
          </div>
        )}

        {/* Admin: Add Category */}
        {isAdmin && !loading && (
          <div className="mt-6">
            <AddCatalogItemForm
              type="category"
              onSubmit={handleAddCategory}
              placeholder="New category name..."
            />
          </div>
        )}
      </main>
    </div>
  );
}
