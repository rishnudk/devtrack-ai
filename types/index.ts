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
    isAiGenerated: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TopicCategory {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubTopic {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    createdBy: string;
    createdAt: Date;
}

export interface SubTopicNote {
    id: string;
    subtopicId: string;
    name: string;
    description: string | null;
    createdBy: string;
    createdAt: Date;
}

export interface catalogCategory extends TopicCategory {
    subtopics: (SubTopic & {
        subtopic_notes: SubTopicNote[]
    })[]
}

export interface userSelectedTopic {
    id : string;
    userId : string;
    categoryId : string;
    subtopicId : string;
    subtopicNoteId : string | null;
    status : TopicStatus;
    progress : number;
    createdAt : Date;
    updatedAt : Date;
    category? : TopicCategory;
    subtopic? : SubTopic;
    subtopic_note? : SubTopicNote | null;
}