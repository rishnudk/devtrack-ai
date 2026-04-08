"use client";

import { useState } from "react";
import { catalogCategory } from "@/types";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import SubtopicItem from "./SubtopicItem";
import AddCatalogItemForm from "./AddCatalogItemForm";
import { toast } from "sonner";

interface CategorySectionProps {
  category: catalogCategory;
  selectedSubtopicIds: Set<string>;
  selectedConceptIds: Set<string>;
  onSelectSubtopic: (categoryId: string, subtopicId: string) => void;
  onSelectConcept: (categoryId: string, subtopicId: string, conceptId: string) => void;
  isAdmin: boolean;
  onAddSubtopic: (categoryId: string, name: string, description?: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onDeleteSubtopic: (categoryId: string, subtopicId: string) => Promise<void>;
  onAddConcept: (categoryId: string, subtopicId: string, name: string, description?: string) => Promise<void>;
  onDeleteConcept: (categoryId: string, subtopicId: string, conceptId: string) => Promise<void>;
}

export default function CategorySection({
  category,
  selectedSubtopicIds,
  selectedConceptIds,
  onSelectSubtopic,
  onSelectConcept,
  isAdmin,
  onAddSubtopic,
  onDeleteCategory,
  onDeleteSubtopic,
  onAddConcept,
  onDeleteConcept,
}: CategorySectionProps) {
  const [expanded, setExpanded] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      await onDeleteCategory(category.id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleAddSubtopic = async (name: string, description?: string) => {
    try {
      await onAddSubtopic(category.id, name, description);
      toast.success("Subtopic added");
    } catch {
      toast.error("Failed to add subtopic");
    }
  };

  return (
    <div className="border border-neutral-900 bg-[#0A0A0A] overflow-hidden">
      {/* Category header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-[#0F0F0F] transition-colors group"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-neutral-500" />
          )}
          <div className="text-left">
            <h3 className="text-white font-medium text-base tracking-tight">{category.name}</h3>
            {category.description && (
              <p className="text-neutral-600 text-xs mt-1">{category.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
            {category.subtopics.length} subtopic{category.subtopics.length !== 1 ? "s" : ""}
          </span>
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteCategory(); }}
              className="text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-neutral-900">
          {category.subtopics.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-neutral-600 text-sm font-mono">No subtopics yet</p>
            </div>
          )}

          {category.subtopics.map((subtopic) => (
            <SubtopicItem
              key={subtopic.id}
              subtopic={subtopic}
              categoryId={category.id}
              selectedSubtopicIds={selectedSubtopicIds}
              selectedConceptIds={selectedConceptIds}
              onSelectSubtopic={(subtopicId) => onSelectSubtopic(category.id, subtopicId)}
              onSelectConcept={(subtopicId, conceptId) => onSelectConcept(category.id, subtopicId, conceptId)}
              isAdmin={isAdmin}
              onAddConcept={onAddConcept}
              onDeleteSubtopic={onDeleteSubtopic}
              onDeleteConcept={onDeleteConcept}
            />
          ))}

          {/* Admin: Add Subtopic */}
          {isAdmin && (
            <div className="px-4 py-2 border-t border-neutral-900">
              <AddCatalogItemForm
                type="subtopic"
                onSubmit={handleAddSubtopic}
                placeholder="Subtopic name..."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
