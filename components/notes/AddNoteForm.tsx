"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface AddNoteFormProps {
  onNoteCreated: (
    title: string,
    content: string,
    isAiGenerated?: boolean
  ) => Promise<void>;
}

export default function AddNoteForm({ onNoteCreated }: AddNoteFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await onNoteCreated(title, content, false);
      toast.success("Note added");
      setTitle("");
      setContent("");
      setOpen(false);
    } catch {
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="border-slate-700 text-foreground hover:text-white hover:bg-card border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Note
      </Button>
    );
  }

  return (
    <Card className="bg-card border-slate-700 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm">New Note</CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Title</Label>
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-card border-slate-700 text-white placeholder:text-muted-foreground h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Content</Label>
            <Textarea
              placeholder="Write your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="bg-card border-slate-700 text-white placeholder:text-muted-foreground resize-none text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Save Note"
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}