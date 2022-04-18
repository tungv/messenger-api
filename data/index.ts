import lodash from "lodash";
import { Low, JSONFile } from "lowdb";

interface User {
  id: string;
  name: string;
}

export interface ConversationDocument {
  id: string;
  participantIds: string[];
  createdAt: string;
}

export interface MessageDoc {
  id: string;
  text: string;
  sentById: string;
  conversationId: string;
  createdAt: string;
}

type Database = {
  users: Array<User>;
  messages: Array<MessageDoc>;
  conversations: Array<ConversationDocument>;
};

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

const adapter = new JSONFile<Database>("data/messenger.json");
const db = new LowWithLodash(adapter);

export { db };
