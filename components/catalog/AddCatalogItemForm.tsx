"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface AddCatalogItemFormProps {
  type: "category" | "subtopic" | "concept";
  onSubmit: (name: string, description?: string, icon?: string) => Promise<void>;
  placeholder?: string;
}

export default function AddCatalogItemForm({ type, onSubmit, placeholder }: AddCatalogItemFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(name.trim(), description.trim() || undefined, type === "category" ? icon.trim() || undefined : undefined);
      setName("");
      setDescription("");
      setIcon("");
      setExpanded(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-neutral-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors py-2"
      >
        <Plus className="h-3 w-3" />
        Add {type}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-800 bg-[#0F0F0F] p-4 space-y-3">
      <input
        autoFocus
        placeholder={placeholder || `${type.charAt(0).toUpperCase() + type.slice(1)} name...`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-[#111] border border-neutral-800 focus:border-white outline-none px-3 py-2 text-white text-sm placeholder:text-neutral-600 transition-colors"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-[#111] border border-neutral-800 focus:border-white outline-none px-3 py-2 text-white text-sm placeholder:text-neutral-600 transition-colors resize-none"
        rows={2}
      />

      {type === "category" && (
        <input
          placeholder="Lucide icon name (e.g. monitor, server)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full bg-[#111] border border-neutral-800 focus:border-white outline-none px-3 py-2 text-white text-sm placeholder:text-neutral-600 transition-colors"
        />
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="border border-white bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-4 py-1.5 text-xs font-medium flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              Adding...
            </>
          ) : (
            "Add"
          )}
        </button>
        <button
          type="button"
          onClick={() => { setExpanded(false); setName(""); setDescription(""); setIcon(""); }}
          className="text-neutral-500 hover:text-white text-xs font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
