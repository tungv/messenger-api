interface User {
  id: string;
  name: string;
}

export interface ConversationDocument {
  id: number;
  createdAt: string;
  participant_1: string;
  participant_2: string;
}

export interface MessageDoc {
  id: string;
  text: string;
  sentBy: string;
  conversationId: string;
  createdAt: string;
}
