"use client";

import { SubTopicNote } from "@/types";
import { Trash2, Check, Plus } from "lucide-react";

interface ConceptItemProps {
  concept: SubTopicNote;
  isSelected: boolean;
  onSelect: () => void;
  isAdmin: boolean;
  onDelete: () => void;
}

export default function ConceptItem({ concept, isSelected, onSelect, isAdmin, onDelete }: ConceptItemProps) {
  return (
    <div className="flex items-center justify-between py-1.5 pl-8 group/concept">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-neutral-700 text-xs select-none">└─</span>
        <span className="text-neutral-400 text-sm truncate">{concept.name}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isSelected ? (
          <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase flex items-center gap-1">
            <Check className="h-3 w-3" /> Added
          </span>
        ) : (
          <button
            onClick={onSelect}
            className="font-mono text-[10px] text-neutral-600 hover:text-white tracking-widest uppercase transition-colors flex items-center gap-1 opacity-0 group-hover/concept:opacity-100"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        )}

        {isAdmin && (
          <button
            onClick={onDelete}
            className="text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover/concept:opacity-100"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
