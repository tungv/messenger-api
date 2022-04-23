import { nanoid } from "nanoid";

import { ConversationDocument, db, MessageDoc } from ".";
import messengerSample from "./messenger-sample.json";
import { filter, findIndex, flow, orderBy } from "lodash/fp";
import { Conversation, Message, PaginatedResponse, User } from "types/api";
export const DEFAULT_PAGE_SIZE = 10;
export type SORT_INDICATOR = "NEWEST_FIRST" | "OLDEST_FIRST";
export type CURSOR = {
  lastSeen?: string;
  sort: SORT_INDICATOR;
};

export async function createNewConversation(accountId: string, user2: string) {
  const conversation: ConversationDocument = {
    id: nanoid(),
    participantIds: [accountId, user2],
    createdAt: String(Date.now()),
  };

  await init();
  db.data?.conversations.push(conversation);
  await db.write();

  return fromConversationDocToConversationAPIResponse(conversation);
}

export async function getConversations(
  accountId: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
) {
  await db.read();

  const filterFn = filter<ConversationDocument>((conversation) => conversation.participantIds.includes(accountId));

  const preSliceRows = filterFn(db.data?.conversations);

  let finalSort = sort;
  let startIndex = 0;

  // if cursor is present, change startIndex and finalSort to match cursor
  if (cursor) {
    const { sort, lastSeen } = JSON.parse(atob(cursor)) as { sort: SORT_INDICATOR; lastSeen: string };
    finalSort = sort;
    startIndex = findIndex<ConversationDocument>((conversation) => conversation.id === lastSeen, preSliceRows);
  }

  const orderByConditions = getOrderByConditions(sort);
  const sortFn = orderBy<ConversationDocument>([orderByConditions[0]], [orderByConditions[1]]);

  const rows = sortFn(preSliceRows)
    .slice(startIndex, startIndex + pageSize)
    .map(fromConversationDocToConversationAPIResponse);

  return getPaginatedResponse<Conversation>(sort, rows);
}

function fromConversationDocToConversationAPIResponse(doc: ConversationDocument): Conversation {
  // get participants from users collection
  const participants = db.data?.users.filter((user) => doc.participantIds.includes(user.id)) || [];

  // get last messages from messages collection
  const lastMessageId = db.data?.messages
    .filter((message) => message.conversationId === doc.id)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0]?.id;

  const lastMessage = getMessage(lastMessageId);

  return {
    id: doc.id,
    participants,
    lastMessage,
  };
}

export function getMessage(id?: string): Message | undefined {
  if (!id) {
    return;
  }
  const msg = db.chain.get("messages").find({ id }).value();

  return {
    id: msg.id,
    text: msg.text,
    sender: getUser(msg.sentById),
    createdAt: msg.createdAt,
  };
}

// get user
export function getUser(id: string): User {
  return db.chain.get("users").find({ id }).value();
}

// fromMessageDocToMessageAPIResponse
function fromMessageDocToMessageAPIResponse(doc: MessageDoc): Message {
  return {
    id: doc.id,
    text: doc.text,
    sender: getUser(doc.sentById),
    createdAt: doc.createdAt,
  };
}

export async function getMessages(
  conversationId: string,
  pageSize: string,
  sort: SORT_INDICATOR = "NEWEST_FIRST",
  cursor: string
): Promise<PaginatedResponse<Message>> {
  await db.read();
  const _pageSize = pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE;

  if (cursor) {
    const { sort, lastSeen } = JSON.parse(atob(cursor));

    console.log({ sort, lastSeen });

    const orderByConditions = getOrderByConditions(sort);
    const cursorIndex = db.chain
      .get("messages")
      .filter({ conversationId })
      .orderBy(...orderByConditions)
      .findIndex((message) => message.id === lastSeen)
      .value();

    if (cursorIndex === -1) {
      throw new Error("Invalid cursor");
    }

    const { startIdx, endIdx } = getRange(cursor, cursorIndex, _pageSize);
    const rows = db.chain
      .get("messages")
      .filter({ conversationId })
      .orderBy(...orderByConditions)
      .slice(startIdx, endIdx)
      .value()
      .map(fromMessageDocToMessageAPIResponse);

    return getPaginatedResponse<Message>(sort, rows);
  }

  const orderByConditions = getOrderByConditions(sort);

  const rows = db.chain
    .get("messages")
    .filter({ conversationId })
    .orderBy(...orderByConditions)
    .slice(0, _pageSize)
    .value()
    .map(fromMessageDocToMessageAPIResponse);

  console.log({ rows });

  return getPaginatedResponse<Message>(sort, rows);
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

  return fromMessageDocToMessageAPIResponse(newMessage);
}

export async function getConversationById(id: string): Promise<Conversation> {
  await db.read();

  return fromConversationDocToConversationAPIResponse(db.chain.get("conversations").find({ id }).value());
}

export async function getAccountById(id: string): Promise<User> {
  await db.read();

  return db.chain.get("users").find({ id }).value();
}

export async function init() {
  if (db.data === null) {
    db.data = messengerSample;
    await db.write();
  }
}

function getOrderByConditions(sort: SORT_INDICATOR): [string, "desc" | "asc"] {
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
  const cursorNext: CURSOR = { sort, lastSeen: rows[0]?.id };
  const cursorPrev: CURSOR = { sort, lastSeen: rows[rows.length - 1]?.id };

  return {
    sort,
    rows,
    cursor_next: rows.length > 0 ? btoa(JSON.stringify(cursorNext)) : null,
    cursor_prev: rows.length > 0 ? btoa(JSON.stringify(cursorPrev)) : null,
  };
}
