import { getClient } from "components/server/supabase";
import withDefaultDb from "components/server/withDb";
import withMethods from "components/server/withMethods";
import { toBase64 } from "components/toBase64";
import { ConversationDocument } from "data";
import { readConversation } from "./conversation/[conversationId]";

export default withDefaultDb(
  withMethods({
    async POST(req, res) {
      const p1 = req.query.accountId as string;
      const p2 = req.query.with as string;

      const supabase = getClient();

      // check for existing conversation
      const existingConversation = await supabase
        .from<ConversationDocument>("conversations")
        .select("id")
        .or(`and(participant_1.eq.${p1},participant_2.eq.${p2}),and(participant_1.eq.${p2},participant_2.eq.${p1})`);

      if (existingConversation.error) {
        console.error(existingConversation.error);
        res.status(500).json({ error: existingConversation.error });
        return;
      }

      if (existingConversation.data) {
        // return existing conversation
        const { id } = existingConversation.data[0];
        const conversation = await readConversation(id);
        res.status(200).json(conversation);
        return;
      }

      const { data, error } = await supabase.from<ConversationDocument>("conversations").insert({
        participant_1: p1,
        participant_2: p2,
      });

      if (!data) {
        console.error(error);
        res.status(500).json({ error });
        return;
      }

      console.log(data);

      const { id } = data[0];
      const conversation = await readConversation(id);
      res.status(200).json(conversation);
    },

    async GET(req, res) {
      const accountId = req.query.accountId as string;
      const pageSize = (req.query.pageSize as string) || "10";

      const supabase = getClient();

      // check for existing conversation
      const conversations = await supabase
        .from<ConversationDocument>("conversations")
        .select("id")
        .or(`participant_1.eq.${accountId},participant_2.eq.${accountId}`)
        .order("id", { ascending: false })
        .limit(Number.parseInt(pageSize));

      if (conversations.error) {
        console.error(conversations.error);
        res.status(500).json({ error: conversations.error });
        return;
      }

      if (!conversations.data) {
        res.status(200).json({
          rows: [],
          sort: "NEWEST_FIRST",
        });
        return;
      }

      const rows = await Promise.all(conversations.data.map(({ id }) => readConversation(id)));

      if (!rows[0]) {
        res.status(200).json({
          rows: [],
          sort: "NEWEST_FIRST",
        });
        return;
      }

      res.status(200).json({
        sort: "NEWEST_FIRST",
        rows,
        cursor_next: toBase64(JSON.stringify({ sort: "NEWEST_FIRST", lastSeen: rows[0].id })),
        cursor_prev: toBase64(JSON.stringify({ sort: "OLDEST_FIRST", lastSeen: rows[rows.length - 1].id })),
      });
    },
  })
);
