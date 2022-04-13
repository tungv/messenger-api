import lodash from "lodash";
import { Low, JSONFile } from "lowdb";

interface User {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  sentById: string;
  conversationId: string;
  createdAt: string;
}

type Database = {
  users: Array<User>;
  messages: Array<Message>;
  conversations: Array<Conversation>;
};

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

const adapter = new JSONFile<Database>("data/messenger.json");
const db = new LowWithLodash(adapter);

export { db };
