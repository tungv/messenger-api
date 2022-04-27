import withMethods from "components/server/withMethods";
import { nanoid } from "nanoid";
import withDefaultDb from "components/server/withDb";
import { getClient } from "components/server/supabase";
import { MessageDoc } from "data";
import { Message } from "types/api";
import { toBase64 } from "components/toBase64";

export default withDefaultDb(
  withMethods({
    async POST(req, res) {
      // create new message and push it to supabase table "messages"
      const accountId = req.query.accountId as string;
      const conversationId = req.query.conversationId as string;

      const text = req.body.text as string;

      const newMessage = {
        text,
        sentBy: accountId,
        conversationId,
      };

      const supabase = getClient();

      const { data, error } = await supabase.from<MessageDoc>("messages").insert([newMessage]);

      if (!data) {
        res.status(500).json({ error });
        return;
      }

      const inserted = data[0];

      // fetch message
      const message = await supabase
        .from<QueriedMessage>("messages")
        .select(
          `
            id,
            text,
            createdAt,
            sendBy:accounts(
              id,
              name
            )
          `
        )
        .eq("id", inserted.id)
        .single();

      if (!message.data) {
        console.error(message.error);
        res.status(500).json({ error: message.error });
        return;
      }

      res.status(201).json(fmt(message.data));
    },

    async GET(req, res) {
      const conversationId = req.query.conversationId as string;

      const pageSize = (req.query.pageSize as string) || "10";

      const supabase = getClient();

      const maybeCursor = Maybe(req.query.cursor as string);

      const maybeParsedCursor = maybeCursor.map((cursor) => fromBase64(cursor) as { lastSeen: string; sort: string });

      const maybeSort = maybeParsedCursor.map((cursor) => cursor.sort);
      const maybeLastSeen = maybeParsedCursor.map((cursor) => Number.parseInt(cursor.lastSeen));

      const isNewestFirst = maybeSort.map((s) => s === "NEWEST_FIRST")[0] ?? true;

      const condition = maybeLastSeen.map((lastSeen) => {
        return [isNewestFirst ? "gt" : "lt", lastSeen] as const;
      })[0] || ["gt", 0];

      // fetch message
      const query = supabase
        .from<QueriedMessage & { conversationId: string }>("messages")
        .select(
          `
            id,
            text,
            createdAt,
            sendBy:accounts(
              id,
              name
            )
          `
        )
        .eq("conversationId", conversationId);

      query[condition[0]]("id", condition[1]).order("createdAt", { ascending: false });

      const { data, error } = await query.limit(Number.parseInt(pageSize));

      if (!data) {
        console.error(error);
        res.status(500).json({ error });
        return;
      }

      if (!isNewestFirst) {
        data.reverse();
      }

      const nextLastSeen = data[0] ? data[0].id : maybeLastSeen[0] || 0;
      const prevLastSeen = data[0] ? data[data.length - 1].id : maybeLastSeen[0] || 0;
      const nextDirection = isNewestFirst ? "NEWEST_FIRST" : "OLDEST_FIRST";
      const prevDirection = isNewestFirst ? "OLDEST_FIRST" : "NEWEST_FIRST";

      res.status(200).json({
        sort: isNewestFirst ? "NEWEST_FIRST" : "OLDEST_FIRST",
        rows: data.map(fmt),
        cursor_next: toBase64(JSON.stringify({ lastSeen: String(nextLastSeen), sort: nextDirection })),
        cursor_prev: toBase64(JSON.stringify({ lastSeen: String(prevLastSeen), sort: prevDirection })),
      });
    },
  })
);

interface QueriedMessage {
  id: number;
  text: string;
  createdAt: string;
  sendBy: { id: string; name: string };
}

function fmt(message: QueriedMessage): Message {
  return {
    id: String(message.id),
    text: message.text,
    createdAt: message.createdAt,
    sender: {
      id: String(message.sendBy.id),
      name: message.sendBy.name,
    },
  };
}

function fromBase64(base64: string) {
  return JSON.parse(Buffer.from(base64, "base64").toString());
}

function Maybe<T>(nullable: T | null): MaybeType<T> {
  return nullable == null ? ([] as const) : ([nullable] as const);
}

interface MaybeType<T> {
  map: <U>(fn: (t: T) => U) => MaybeType<U>;
  [index: number]: T | undefined;
}
