import type { NextApiRequest, NextApiResponse } from "next";

import repository, { SORT_INDICATOR } from "data/repository";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getConversation();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getConversation() {
    try {
      let { conversationId, pageSize, sort, cursor } = req.query;
      if (sort !== "NEWEST_FIRST" && sort !== "OLDEST_FIRST") {
        sort = "NEWEST_FIRST";
      }

      const result = await repository.getConversations(
        conversationId as string,
        +pageSize,
        sort as SORT_INDICATOR,
        cursor as string
      );

      const body = {
        rows: result.rows,
        sort: result.sort,
        cursor_next: result.cursor_next,
        cursor_prev: result.cursor_prev,
      };

      return res.status(200).json(body);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
