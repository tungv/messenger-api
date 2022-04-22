import { useEffect, useState } from "react";

import { RequestConversations, Conversations, RequestMessages, Messages } from "./types";
import { getConversations, getMessages } from "./services";

export const useConversations = ({ accountId }: RequestConversations) => {
  const [conversations, setConversations] = useState<Conversations | null>(null);

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
  const [messages, setMessages] = useState<Messages | null>(null);

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
