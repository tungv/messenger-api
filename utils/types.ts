export interface RequestConversations {
  accountId: string;
}

export interface RequestMessages {
  accountId: string;
  conversationId: string | undefined;
}
