export interface RequestConversations {
  accountId: string;
}

export interface RequestMessages {
  accountId: string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageId: string;
  createdAt: string;
}

export interface Conversations {
  sort: string;
  rows: Conversation[];
  cursor_next: string;
  cursor_prev: string;
}

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  conversationId: string;
  createdAt: string;
}

export interface Messages {
  sort: string;
  rows: Message[];
  cursor_next: string;
  cursor_prev: string;
}
