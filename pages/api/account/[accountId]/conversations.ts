import type { NextApiRequest, NextApiResponse } from "next";

import * as repository from "data/repository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getConversations(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getConversations(req: NextApiRequest, res: NextApiResponse) {
  await repository.init();

  try {
    let { conversationId, pageSize, sort, cursor } = req.query;
    if (sort !== "NEWEST_FIRST" && sort !== "OLDEST_FIRST") {
      sort = "NEWEST_FIRST";
    }

    const result = await repository.getConversations(
      conversationId as string,
      pageSize as string,
      sort as repository.SORT_INDICATOR,
      cursor as string
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
