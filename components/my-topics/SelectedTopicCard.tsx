"use client";

import { userSelectedTopic } from "@/types";
import { Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SelectedTopicCardProps {
  selectedTopic: userSelectedTopic;
  onRemove: (id: string) => Promise<void>;
}

const statusConfig: Record<string, string> = {
  not_started: "NOT STARTED",
  in_progress: "IN PROGRESS",
  completed: "COMPLETED",
};

export default function SelectedTopicCard({ selectedTopic, onRemove }: SelectedTopicCardProps) {
  const router = useRouter();
  const statusLabel = statusConfig[selectedTopic.status] || "UNKNOWN";

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onRemove(selectedTopic.id);
      toast.success("Topic removed from list");
    } catch {
      toast.error("Failed to remove topic");
    }
  };

  // Build breadcrumb from joined data
  const breadcrumb = [
    selectedTopic.category?.name,
    selectedTopic.subtopic?.name,
    selectedTopic.subtopic_note?.name,
  ].filter(Boolean).join(" › ");

  const displayName = selectedTopic.subtopic_note?.name || selectedTopic.subtopic?.name || "Topic";

  return (
    <div
      className="group border border-neutral-900 bg-[#0A0A0A] p-6 hover:border-white transition-colors cursor-pointer flex flex-col h-full justify-between"
      onClick={() => router.push(`/my-topics/${selectedTopic.id}`)}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
            [ {statusLabel} ]
          </span>
          <button
            className="text-neutral-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleRemove}
            title="Remove from list"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <h4 className="text-white text-xl font-medium tracking-tight mb-2">
          {displayName}
        </h4>

        <p className="text-neutral-600 text-xs font-mono truncate mt-1">
          {breadcrumb}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
          <span className="text-neutral-500 flex items-center gap-2 group-hover:text-white transition-colors">
            VIEW DETAILS <ArrowRight className="h-3 w-3" />
          </span>
          <span className="text-white">{selectedTopic.progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-neutral-900">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${selectedTopic.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
