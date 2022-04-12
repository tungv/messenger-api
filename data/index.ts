import lodash from "lodash";
import { Low, JSONFile } from "lowdb";

interface User {
  id: string;
  name: string;
}

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageId: string;
  createdAt: string;
}

interface Message {
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

const adapter = new JSONFile<Database>("data/sample.json");
const db = new LowWithLodash(adapter);

if (db.data === null) {
  db.data = {
    users: [
      { id: "1", name: "Will Smith" },
      { id: "2", name: "Jada" },
      { id: "3", name: "Jaden" },
      { id: "4", name: "Chris Rock" },
    ],
    messages: [
      {
        id: "1",
        sentById: "3",
        text: 'You "rock"!!!',
        conversationId: "1",
        createdAt: "1612312332312",
      },
      {
        id: "2",
        sentById: "1",
        text: "Don't do that again",
        conversationId: "1",
        createdAt: "1612312312312",
      },
      {
        id: "3",
        sentById: "2",
        text: "I love you",
        conversationId: "1",
        createdAt: "1612312312324",
      },
    ],
    conversations: [
      {
        id: "1",
        participantIds: ["1", "2"],
        lastMessageId: "1",
        createdAt: "1649676569",
      },
      {
        id: "2",
        participantIds: ["1", "3"],
        lastMessageId: "2",
        createdAt: "1649676579",
      },
      {
        id: "3",
        participantIds: ["1", "4"],
        lastMessageId: "3",
        createdAt: "1649676589",
      },
    ],
  };

  db.write();
}

export { db };
