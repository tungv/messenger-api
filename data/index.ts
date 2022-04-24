interface User {
  id: string;
  name: string;
}

export interface ConversationDocument {
  id: string;
  participantIds: string[];
  createdAt: string;
}

export interface MessageDoc {
  id: string;
  text: string;
  sentBy: string;
  conversationId: string;
  createdAt: string;
}
