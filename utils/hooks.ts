import { useEffect, useState } from "react";

import { RequestConversations, RequestMessages } from "./types";
import { PaginatedResponse, Conversation, Message } from "../types/api";
import { getConversations, getMessages } from "./services";

export const useConversations = ({ accountId }: RequestConversations) => {
  const [conversations, setConversations] = useState<PaginatedResponse<Conversation> | null>(null);

  useEffect(() => {
    getConversations({ accountId })
      .then((res) => {
        setConversations(res.data);
      })
      .catch(() => {
        setConversations(null);
      });
  }, [accountId]);

  return conversations;
};

export const useMessages = ({ accountId, conversationId }: RequestMessages) => {
  const [messages, setMessages] = useState<PaginatedResponse<Message> | null>(null);

  useEffect(() => {
    getMessages({ accountId, conversationId })
      .then((res) => {
        setMessages(res.data);
      })
      .catch(() => {
        setMessages(null);
      });
  }, [accountId, conversationId]);

  return messages;
};
