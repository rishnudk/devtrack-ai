"use client";

import { Topic } from "@/types";
import { Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TopicCardProps {
  topic: Topic;
  onDelete: (topicId: string) => Promise<void>;
}

const statusConfig = {
  not_started: "NOT STARTED",
  in_progress: "IN PROGRESS",
  completed: "COMPLETED",
};

export default function TopicCard({ topic, onDelete }: TopicCardProps) {
  const router = useRouter();
  const statusLabel = statusConfig[topic.status];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDelete(topic.id);
      toast.success("Record deleted");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  return (
    <div
      className="group border border-neutral-900 bg-[#0A0A0A] p-6 hover:border-white transition-colors cursor-pointer flex flex-col h-full justify-between"
      onClick={() => router.push(`/topics/${topic.id}`)}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
            [ {statusLabel} ]
          </span>
          <button
            className="text-neutral-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleDelete}
            title="Delete Topic"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <h4 className="text-white text-xl font-medium tracking-tight mb-2">
          {topic.name}
        </h4>
        
        {topic.description && (
          <p className="text-neutral-500 text-sm font-light line-clamp-2 mt-2 leading-relaxed">
            {topic.description}
          </p>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
           <span className="text-neutral-500 flex items-center gap-2 group-hover:text-white transition-colors">
            ACCESS RECORD <ArrowRight className="h-3 w-3" />
          </span>
          <span className="text-white">{topic.progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-neutral-900">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${topic.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}