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
    const accountId = req.query.accountId as string;
    const cursor = req.query.cursor as string;
    let sort = req.query.sort as repository.SORT_INDICATOR;

    if (sort !== "NEWEST_FIRST" && sort !== "OLDEST_FIRST") {
      sort = "NEWEST_FIRST";
    }

    const pageSize = Number.parseInt(req.query.pageSize as string, 10) || 10;

    const result = await repository.getConversations(accountId, pageSize, sort, cursor);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
