import { nanoid } from "nanoid";

import { db } from ".";

export const DEFAULT_PAGE_SIZE = 10;
export type SORT_INDICATOR = "NEWEST_FIRST" | "OLDEST_FIRST";

async function getConversations(
  conversationId: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
) {
  return db.read().then(() => {
    if (cursor) {
      const { sort, lastSeen } = JSON.parse(atob(cursor));

      const orderByConditions = sort === "NEWEST_FIRST" ? ["createdAt", "desc"] : ["createdAt", "asc"];

      const cursorIndex = db.chain
        .get("conversations")
        .filter({ id: conversationId })
        .orderBy(orderByConditions)
        .findIndex((message) => message.id === lastSeen)
        .value();

      if (cursorIndex === -1) {
        throw new Error("Invalid cursor");
      }

      const messages = db.chain
        .get("conversations")
        .filter({ id: conversationId })
        .orderBy(orderByConditions)
        .slice(cursorIndex + 1, pageSize)
        .value();

      return {
        rows: messages,
        sort,
        cursor_next: messages[0]?.id,
        cursor_prev: messages[messages.length - 1]?.id,
      };
    }

    const orderByConditions = sort === "NEWEST_FIRST" ? ["createdAt", "desc"] : ["createdAt", "asc"];
    const messages = db.chain
      .get("conversations")
      .filter({ id: conversationId })
      .orderBy(orderByConditions)
      .slice(0, pageSize)
      .value();

    return {
      rows: messages,
      sort,
      cursor_next: messages[0]?.id,
      cursor_prev: messages[messages.length - 1]?.id,
    };
  });
}

async function getMessages(
  conversationId: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
) {
  return db.read().then(() => {
    if (cursor) {
      const { sort, lastSeen } = JSON.parse(atob(cursor));

      const orderByConditions = sort === "NEWEST_FIRST" ? ["createdAt", "desc"] : ["createdAt", "asc"];

      const cursorIndex = db.chain
        .get("messages")
        .filter({ conversationId })
        .orderBy(orderByConditions)
        .findIndex((message) => message.id === lastSeen)
        .value();

      if (cursorIndex === -1) {
        throw new Error("Invalid cursor");
      }

      const messages = db.chain
        .get("messages")
        .filter({ conversationId })
        .orderBy(orderByConditions)
        .slice(cursorIndex + 1, pageSize)
        .value();

      return {
        rows: messages,
        sort,
        cursor_next: messages[0]?.id,
        cursor_prev: messages[messages.length - 1]?.id,
      };
    }

    const orderByConditions = sort === "NEWEST_FIRST" ? ["createdAt", "desc"] : ["createdAt", "asc"];
    const messages = db.chain
      .get("messages")
      .filter({ conversationId })
      .orderBy(orderByConditions)
      .slice(0, pageSize)
      .value();

    return {
      rows: messages,
      sort,
      cursor_next: messages[0]?.id,
      cursor_prev: messages[messages.length - 1]?.id,
    };
  });
}

async function createNewMessage(sentById: string, text: string, conversationId: string) {
  const newMessage = {
    id: nanoid(),
    text,
    sentById,
    conversationId,
    createdAt: Date.now().toString(),
  };

  db.data?.messages.push(newMessage);
  db.write();

  return newMessage;
}

async function getConversation(id: string) {
  return db.read().then(() => {
    return db.chain.get("conversations").find({ id }).value();
  });
}

const repository = {
  getMessages,
  getConversation,
  createNewMessage,
  getConversations,
};

export default repository;
