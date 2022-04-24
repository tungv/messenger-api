import Api from "./Api";

import { RequestConversations, RequestMessages, SendMessage } from "./types";

export const getConversations = async ({ accountId }: RequestConversations) =>
  await Api.get(`/api/account/${accountId}/conversations`);

export const getMessages = async ({ accountId, conversationId }: RequestMessages) =>
  await Api.get(`/api/account/${accountId}/conversation/${conversationId}/messages`);

export const sendMessage = async ({ accountId, conversationId, text }: SendMessage) =>
  await Api.post(`/api/account/${accountId}/conversation/${conversationId}/messages`, {
    text,
  });
