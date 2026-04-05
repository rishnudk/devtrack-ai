"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      toast.success("Record created successfully.");
      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to initialize system record");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border border-white bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-2.5 text-sm font-medium flex items-center">
          <Plus className="h-4 w-4 mr-2" strokeWidth={2.5}/>
          Initialize Record
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0A0A0A] border border-neutral-800 text-white p-0 rounded-none w-full max-w-lg">
        <div className="p-8 border-b border-neutral-900">
          <DialogTitle className="text-xl font-medium tracking-tight mb-2">Initialize New Record</DialogTitle>
          <DialogDescription className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
            System requires a topic identifier and context.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest">Identifier [Name]</label>
              <input
                placeholder="e.g. React Hooks, Node.js"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#111] border border-neutral-800 focus:border-white outline-none px-4 py-3 text-white placeholder:text-neutral-600 transition-colors rounded-none"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Context [Description] <span className="text-neutral-600">-- OPTIONAL</span>
              </label>
              <textarea
                placeholder="Define learning parameters..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#111] border border-neutral-800 focus:border-white outline-none px-4 py-3 text-white placeholder:text-neutral-600 resize-none transition-colors rounded-none"
                rows={3}
              />
            </div>
          </div>

          <div className="p-8 border-t border-neutral-900 flex justify-end gap-4 bg-[#0A0A0A]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-neutral-500 hover:text-white px-6 py-2.5 text-sm font-medium transition-colors border border-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="border border-white bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-8 py-2.5 text-sm font-medium flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Execute"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}