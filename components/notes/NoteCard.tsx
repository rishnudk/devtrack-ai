"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string) => Promise<void>;
  onUpdate: (
    noteId: string,
    data: { title?: string; content?: string }
  ) => Promise<void>;
}

export default function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await onUpdate(note.id, { title, content });
      toast.success("Note updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(note.id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <Card className="bg-card border-slate-800 group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-card border-slate-700 text-white h-8 text-sm font-semibold"
            />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="text-white font-semibold text-sm truncate">
                {note.title}
              </h4>
              {note.isAiGenerated === "true" && (
                <Badge className="bg-purple-500/20 text-primary hover:bg-purple-500/20 shrink-0 text-xs">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {editing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-white"
                  onClick={handleCancel}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-slate-600 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {editing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-card border-slate-700 text-white text-sm resize-none min-h-[120px]"
          />
        ) : (
          <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        )}

        <p className="text-slate-600 text-xs">
          {format(new Date(note.createdAt), "MMM d, yyyy · h:mm a")}
        </p>
      </CardContent>
    </Card>
  );
}