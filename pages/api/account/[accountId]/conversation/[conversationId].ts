import type { NextApiRequest, NextApiResponse } from "next";

import { init, getConversationById } from "data/repository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getConversation(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getConversation(req: NextApiRequest, res: NextApiResponse) {
  await init();

  const result = await getConversationById(req.query.conversationId as string);

  return res.status(200).json(result);
}
