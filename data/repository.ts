import { nanoid } from "nanoid";

import { Conversation, db, Message } from ".";
import messengerSample from "./messenger-sample.json";

export const DEFAULT_PAGE_SIZE = 2;
export type SORT_INDICATOR = "NEWEST_FIRST" | "OLDEST_FIRST";
export type CURSOR = {
  direction: "next" | "prev";
  lastSeen?: string;
  sort: SORT_INDICATOR;
};

export async function getConversations(
  conversationId: string,
  pageSize: string,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
) {
  return db.read().then(() => {
    const _pageSize = pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE;

    if (cursor) {
      const { sort, lastSeen } = JSON.parse(atob(cursor));

      const orderByConditions = getOrderByConditions(sort);
      const cursorIndex = db.chain
        .get("conversations")
        .filter({ id: conversationId })
        .orderBy(orderByConditions)
        .findIndex((message) => message.id === lastSeen)
        .value();

      if (cursorIndex === -1) {
        throw new Error("Invalid cursor");
      }

      const { startIdx, endIdx } = getRange(cursor, cursorIndex, _pageSize);
      const rows = db.chain
        .get("conversations")
        .filter({ id: conversationId })
        .orderBy(orderByConditions)
        .slice(startIdx, endIdx)
        .value();

      return getPaginatedResponse<Conversation>(sort, rows);
    }

    const orderByConditions = getOrderByConditions(sort);
    const rows = db.chain
      .get("conversations")
      .filter({ id: conversationId })
      .orderBy(orderByConditions)
      .slice(0, _pageSize)
      .value();

    return getPaginatedResponse<Conversation>(sort, rows);
  });
}

export async function getMessages(
  conversationId: string,
  pageSize: string,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
) {
  return db.read().then(() => {
    const _pageSize = pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE;

    if (cursor) {
      const { sort, lastSeen } = JSON.parse(atob(cursor));

      const orderByConditions = getOrderByConditions(sort);
      const cursorIndex = db.chain
        .get("messages")
        .filter({ conversationId })
        .orderBy(orderByConditions)
        .findIndex((message) => message.id === lastSeen)
        .value();

      if (cursorIndex === -1) {
        throw new Error("Invalid cursor");
      }

      const { startIdx, endIdx } = getRange(cursor, cursorIndex, _pageSize);
      const rows = db.chain
        .get("messages")
        .filter({ conversationId })
        .orderBy(orderByConditions)
        .slice(startIdx, endIdx)
        .value();

      return getPaginatedResponse<Message>(sort, rows);
    }

    const orderByConditions = getOrderByConditions(sort);
    const rows = db.chain
      .get("messages")
      .filter({ conversationId })
      .orderBy(orderByConditions)
      .slice(0, _pageSize)
      .value();

    return getPaginatedResponse<Message>(sort, rows);
  });
}

export async function createNewMessage(sentById: string, text: string, conversationId: string) {
  const newMessage = {
    id: nanoid(),
    text,
    sentById,
    conversationId,
    createdAt: Date.now().toString(),
  };

  db.data?.messages.push(newMessage);
  await db.write();

  return newMessage;
}

export async function getConversation(id: string) {
  return db.read().then(() => {
    return db.chain.get("conversations").find({ id }).value();
  });
}

export async function init() {
  if (db.data === null) {
    db.data = messengerSample;
    await db.write();
  }
}

function getOrderByConditions(sort: SORT_INDICATOR) {
  return sort === "NEWEST_FIRST" ? ["createdAt", "desc"] : ["createdAt", "asc"];
}

function getRange(cursor: string, cursorIndex: number, pageSize: number) {
  const { direction } = JSON.parse(atob(cursor));

  let startIdx, endIdx;

  if (direction === "next") {
    startIdx = cursorIndex + 1;
    endIdx = cursorIndex + 1 + pageSize;
  } else {
    startIdx = cursorIndex - pageSize;
    endIdx = cursorIndex;
  }

  return { startIdx, endIdx };
}

function getPaginatedResponse<T extends { id: string }>(sort: SORT_INDICATOR, rows: Array<T>) {
  const cursorNext: CURSOR = { sort, lastSeen: rows[rows.length - 1]?.id, direction: "next" };
  const cursorPrev: CURSOR = { sort, lastSeen: rows[0]?.id, direction: "prev" };

  return {
    sort,
    rows,
    cursor_next: rows.length > 0 ? btoa(JSON.stringify(cursorNext)) : null,
    cursor_prev: rows.length > 0 ? btoa(JSON.stringify(cursorPrev)) : null,
  };
}
