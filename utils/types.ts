export interface RequestConversations {
  accountId: string;
}

export interface RequestMessages {
  accountId: string;
  conversationId: string | undefined;
}

export interface SendMessage extends RequestMessages {
  text: string;
}
