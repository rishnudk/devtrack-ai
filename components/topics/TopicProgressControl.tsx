"use client";

import { useState } from "react";
import { Topic, TopicStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TopicProgressControlProps {
  topic: Topic;
  onUpdate: (data: Partial<Topic>) => Promise<void>;
}

const statusOptions: { value: TopicStatus; label: string; className: string }[] = [
  {
    value: "not_started",
    label: "Not Started",
    className: "text-slate-300",
  },
  {
    value: "in_progress",
    label: "In Progress",
    className: "text-yellow-400",
  },
  {
    value: "completed",
    label: "Completed",
    className: "text-green-400",
  },
];

export default function TopicProgressControl({
  topic,
  onUpdate,
}: TopicProgressControlProps) {
  const [progress, setProgress] = useState(topic.progress);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (status: TopicStatus) => {
    setSaving(true);
    try {
      // Auto set progress when status changes
      const autoProgress =
        status === "completed"
          ? 100
          : status === "not_started"
          ? 0
          : progress;

      await onUpdate({ status, progress: autoProgress });
      setProgress(autoProgress);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleProgressSave = async () => {
    setSaving(true);
    try {
      // Auto update status based on progress
      const autoStatus: TopicStatus =
        progress === 100
          ? "completed"
          : progress === 0
          ? "not_started"
          : "in_progress";

      await onUpdate({ progress, status: autoStatus });
      toast.success("Progress updated");
    } catch {
      toast.error("Failed to update progress");
    } finally {
      setSaving(false);
    }
  };

  const currentStatus = statusOptions.find((s) => s.value === topic.status);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
      <h3 className="text-white font-semibold text-sm">Progress Tracking</h3>

      {/* Status selector */}
      <div className="space-y-2">
        <label className="text-slate-400 text-xs">Status</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              disabled={saving}
            >
              <span className={cn("font-medium", currentStatus?.className)}>
                {currentStatus?.label}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700 w-48">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={cn(
                  "cursor-pointer hover:bg-slate-700 focus:bg-slate-700",
                  option.className
                )}
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-slate-400 text-xs">Progress</label>
          <span className="text-white text-sm font-semibold">{progress}%</span>
        </div>

        <Slider
          value={[progress]}
          onValueChange={(val) => setProgress(val[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-slate-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        <Button
          onClick={handleProgressSave}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={saving || progress === topic.progress}
        >
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Progress"
          )}
        </Button>
      </div>
    </div>
  );
}