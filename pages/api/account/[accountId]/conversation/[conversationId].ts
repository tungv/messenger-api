import { getClient } from "components/server/supabase";
import withDefaultDb from "components/server/withDb";
import withMethods from "components/server/withMethods";
import { MessageDoc } from "data";

export default withDefaultDb(
  withMethods({
    async GET(req, res) {
      const conversationId = req.query.conversationId as string;

      const supabase = getClient();

      const { data, error } = await supabase
        .from<MessageDoc & { conversationId: string }>("messages")
        .select(
          `
          id,
          text,
          createdAt,
          sender:accounts (
            id,
            name
          ),
          conversation:conversations (
            id,
            p1:accounts!conversations_participant_1_fkey (id,name),
            p2:accounts!conversations_participant_2_fkey (id,name)
          )
        `
        )
        .eq("conversationId", conversationId)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (!data) {
        console.error(error);
        res.status(500).json({ error });
        return;
      }

      console.log(data);

      const { id, text, createdAt, sender, conversation } = data as any;

      const conversationObj = {
        id: String(conversation.id),
        participants: [
          { id: String(conversation.p1.id), name: conversation.p1.name },
          { id: String(conversation.p2.id), name: conversation.p2.name },
        ],
        lastMessage: {
          id: String(id),
          text,
          sender: {
            id: String(sender.id),
            name: sender.name,
          },
          createdAt,
        },
      };

      res.status(200).json(conversationObj);
    },
  })
);
