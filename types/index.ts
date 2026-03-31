export type TopicStatus = "not_started" | "in_progress" | "completed";

export interface Topic {
    id: string;
    userId: string;
    name: string;
    description: string;
    status: TopicStatus;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Note {
    id: string;
    topicId: string;
    userId: string;
    title: string;
    content: string;
    isAiGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}
