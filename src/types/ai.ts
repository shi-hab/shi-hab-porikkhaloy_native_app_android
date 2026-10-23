export interface AIMessage {
  id: string | number;
  conversation_id?: string;
  sender: "user" | "assistant";
  message: string;
  assistant_type?: "education" | "health";
  attachment_url?: string;
  created_at: string;
  feedback?: "like" | "dislike" | null;
  thinking_steps?: string[];
}

export interface AIConversation {
  uuid: string;
  title: string;
  assistant_type: "education" | "health";
  updated_at: string;
  messages_count?: number;
}

export interface AIUsage {
  remaining_credits: number;
  total_credits: number;
  resets_at?: string;
}
