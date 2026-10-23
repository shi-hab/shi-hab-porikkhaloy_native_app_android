import { apiClient } from "./apiClient";
import { AIConversation, AIMessage, AIUsage } from "../types/ai";

export const aiService = {
  async getUsage(): Promise<AIUsage> {
    const response = await apiClient.get<AIUsage>("/ai/usage");
    return response.data;
  },

  async getConversations(type?: "education" | "health"): Promise<AIConversation[]> {
    const response = await apiClient.get<AIConversation[]>("/ai/conversations", {
      params: type ? { assistant_type: type } : undefined,
    });
    return response.data;
  },

  async getConversation(uuid: string): Promise<{ conversation: AIConversation; messages: AIMessage[] }> {
    const response = await apiClient.get(`/ai/conversations/${uuid}`);
    return response.data;
  },

  async sendMessage(params: {
    message: string;
    conversation_uuid?: string;
    assistant_type: "education" | "health";
    imageUri?: string;
  }): Promise<{ message: AIMessage; reply: AIMessage }> {
    const formData = new FormData();
    formData.append("message", params.message);
    formData.append("assistant_type", params.assistant_type);
    if (params.conversation_uuid) {
      formData.append("conversation_id", params.conversation_uuid);
    }
    if (params.imageUri) {
      const filename = params.imageUri.split("/").pop() || "upload.jpg";
      formData.append("image", {
        uri: params.imageUri,
        name: filename,
        type: "image/jpeg",
      } as any);
    }

    const idempotencyKey = `ai_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const response = await apiClient.post("/ai/chat", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Idempotency-Key": idempotencyKey,
      },
    });
    return response.data;
  },

  async deleteConversation(uuid: string): Promise<void> {
    await apiClient.delete(`/ai/conversations/${uuid}`);
  },

  async provideFeedback(messageId: string | number, feedback: "like" | "dislike"): Promise<void> {
    await apiClient.patch(`/ai/messages/${messageId}/feedback`, { feedback });
  },
};
