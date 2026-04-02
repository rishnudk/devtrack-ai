"use client";

import { Topic } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TopicCardProps {
  topic: Topic;
  onDelete: (topicId: string) => Promise<void>;
}

const statusConfig = {
  not_started: {
    label: "Not Started",
    className: "bg-slate-700 text-foreground hover:bg-slate-700",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/20 text-green-400 hover:bg-green-500/20",
  },
};

export default function TopicCard({ topic, onDelete }: TopicCardProps) {
  const router = useRouter();
  const status = statusConfig[topic.status];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDelete(topic.id);
      toast.success("Topic deleted");
    } catch {
      toast.error("Failed to delete topic");
    }
  };

  return (
    <Card
      className="bg-card border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group"
      onClick={() => router.push(`/topics/${topic.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-primary text-primary-foreground/20 rounded-md shrink-0">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-white font-semibold truncate">{topic.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {topic.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {topic.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={status.className}>{status.label}</Badge>
          <span className="text-muted-foreground text-sm">{topic.progress}%</span>
        </div>

        <Progress
          value={topic.progress}
          className="h-1.5 bg-card"
        />

        <div className="flex items-center justify-end">
          <span className="text-primary text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
            Open topic <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}