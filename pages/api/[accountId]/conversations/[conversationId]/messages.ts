import type { NextApiRequest, NextApiResponse } from "next";

import repository, { SORT_INDICATOR } from "data/repository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getMessages();
    case "POST":
      return createMessage();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getMessages() {
    await repository.init();

    try {
      let { conversationId, pageSize, sort, cursor } = req.query;
      if (sort !== "NEWEST_FIRST" && sort !== "OLDEST_FIRST") {
        sort = "NEWEST_FIRST";
      }

      const result = await repository.getMessages(
        conversationId as string,
        pageSize as string,
        sort as SORT_INDICATOR,
        cursor as string
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async function createMessage() {
    await repository.init();

    try {
      const { conversationId } = req.query;
      const { text, sentById } = req.body;

      if (!sentById || !text || !conversationId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const createdMessage = await repository.createNewMessage(sentById, text, conversationId as string);

      return res.status(201).json({ data: createdMessage });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
