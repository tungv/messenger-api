import { getClient } from "components/server/supabase";
import withDefaultDb from "components/server/withDb";
import withMethods from "components/server/withMethods";
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
  })
);
