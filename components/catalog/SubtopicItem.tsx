"use client";

import { SubTopic, SubTopicNote } from "@/types";
import { Trash2, Check, Plus } from "lucide-react";
import ConceptItem from "./ConceptItem";
import AddCatalogItemForm from "./AddCatalogItemForm";
import { toast } from "sonner";

interface SubtopicItemProps {
  subtopic: SubTopic & { subtopic_notes: SubTopicNote[] };
  categoryId: string;
  selectedSubtopicIds: Set<string>;
  selectedConceptIds: Set<string>;
  onSelectSubtopic: (subtopicId: string) => void;
  onSelectConcept: (subtopicId: string, conceptId: string) => void;
  isAdmin: boolean;
  onAddConcept: (categoryId: string, subtopicId: string, name: string, description?: string) => Promise<void>;
  onDeleteSubtopic: (categoryId: string, subtopicId: string) => Promise<void>;
  onDeleteConcept: (categoryId: string, subtopicId: string, conceptId: string) => Promise<void>;
}

export default function SubtopicItem({
  subtopic,
  categoryId,
  selectedSubtopicIds,
  selectedConceptIds,
  onSelectSubtopic,
  onSelectConcept,
  isAdmin,
  onAddConcept,
  onDeleteSubtopic,
  onDeleteConcept,
}: SubtopicItemProps) {
  const isSubtopicSelected = selectedSubtopicIds.has(subtopic.id);

  const handleDeleteSubtopic = async () => {
    try {
      await onDeleteSubtopic(categoryId, subtopic.id);
      toast.success("Subtopic deleted");
    } catch {
      toast.error("Failed to delete subtopic");
    }
  };

  const handleDeleteConcept = async (conceptId: string) => {
    try {
      await onDeleteConcept(categoryId, subtopic.id, conceptId);
      toast.success("Concept deleted");
    } catch {
      toast.error("Failed to delete concept");
    }
  };

  const handleAddConcept = async (name: string, description?: string) => {
    try {
      await onAddConcept(categoryId, subtopic.id, name, description);
      toast.success("Concept added");
    } catch {
      toast.error("Failed to add concept");
    }
  };

  return (
    <div className="group/subtopic">
      <div className="flex items-center justify-between py-2.5 px-4 hover:bg-[#111] transition-colors">
        <div className="min-w-0">
          <h4 className="text-white text-sm font-medium">{subtopic.name}</h4>
          {subtopic.description && (
            <p className="text-neutral-600 text-xs mt-0.5 truncate">{subtopic.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isSubtopicSelected ? (
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase flex items-center gap-1.5 border border-neutral-800 px-3 py-1">
              <Check className="h-3 w-3" /> Added
            </span>
          ) : (
            <button
              onClick={() => onSelectSubtopic(subtopic.id)}
              className="font-mono text-[10px] text-neutral-500 hover:text-black hover:bg-white tracking-widest uppercase transition-all flex items-center gap-1.5 border border-neutral-800 hover:border-white px-3 py-1"
            >
              <Plus className="h-3 w-3" /> Add to list
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleDeleteSubtopic}
              className="text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover/subtopic:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Concepts */}
      {subtopic.subtopic_notes.length > 0 && (
        <div className="border-l border-neutral-900 ml-4 mb-2">
          {subtopic.subtopic_notes.map((concept) => (
            <ConceptItem
              key={concept.id}
              concept={concept}
              isSelected={selectedConceptIds.has(concept.id)}
              onSelect={() => onSelectConcept(subtopic.id, concept.id)}
              isAdmin={isAdmin}
              onDelete={() => handleDeleteConcept(concept.id)}
            />
          ))}
        </div>
      )}

      {/* Admin: Add Concept */}
      {isAdmin && (
        <div className="pl-8 pb-2">
          <AddCatalogItemForm
            type="concept"
            onSubmit={handleAddConcept}
            placeholder="Concept name..."
          />
        </div>
      )}
    </div>
  );
}
