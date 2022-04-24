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
