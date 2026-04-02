"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateTopicDialogProps {
  onTopicCreated: (name: string, description?: string) => Promise<void>;
}

export default function CreateTopicDialog({
  onTopicCreated,
}: CreateTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onTopicCreated(name, description || undefined);
      toast.success("Topic created!", {
        description: `"${name}" has been added.`,
      });
      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create topic");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Topic
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new topic to track your learning progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Topic Name</Label>
              <Input
                placeholder="e.g. React Hooks, Node.js, MongoDB"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-card border-slate-700 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="What do you want to learn about this topic?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-card border-slate-700 text-white placeholder:text-muted-foreground resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}