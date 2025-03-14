import { create } from "zustand";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  model?: string;
  timestamp: Date;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Omit<Message, "timestamp">) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),
  clearMessages: () => set({ messages: [] }),
}));
