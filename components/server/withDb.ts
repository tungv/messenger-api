import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withDb } from "./supabase";

export default function withDefaultDb(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    return withDb(async () => await handler(req, res));
  };
}
