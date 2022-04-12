import type { NextApiRequest, NextApiResponse } from "next";

import repository from "data/repository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getConversations();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getConversations() {
    try {
      const conversations = await repository.getConversations();

      return res.status(200).json({ data: conversations });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
