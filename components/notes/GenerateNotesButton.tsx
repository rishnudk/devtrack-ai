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
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GenerateNotesButtonProps {
  topicName: string;
  onGenerated: (
    title: string,
    content: string,
    isAiGenerated: boolean
  ) => Promise<void>;
}

export default function GenerateNotesButton({
  topicName,
  onGenerated,
}: GenerateNotesButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subtopic, setSubtopic] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    const toastId = toast.loading("Generating notes with AI...");

    try {
      const res = await fetch("/api/ai/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName,
          subtopic: subtopic.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate notes");

      const { content } = await res.json();
      const title = subtopic.trim()
        ? `${subtopic} — AI Notes`
        : `${topicName} — AI Notes`;

      await onGenerated(title, content, true);

      toast.dismiss(toastId);
      toast.success("Notes generated!", {
        description: "AI notes have been added to your topic.",
      });

      setSubtopic("");
      setOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to generate notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-700 text-primary hover:text-purple-300 hover:bg-primary/10 hover:border-purple-600"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate AI Notes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            AI will generate structured notes for{" "}
            <span className="text-white font-medium">{topicName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">
              Subtopic{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              placeholder={`e.g. useState, useEffect, Custom Hooks...`}
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              className="bg-card border-slate-700 text-white placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleGenerate();
              }}
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to generate general notes about {topicName}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-white"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Notes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}