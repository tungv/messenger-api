import { SORT_INDICATOR } from "data/repository";

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
}

export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  rows: T[];
  sort: SORT_INDICATOR;
  cursor_next: string | null;
  cursor_prev: string | null;
}
