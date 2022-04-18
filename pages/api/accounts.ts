import { db } from "data";
import { init } from "data/repository";
import { NextApiRequest, NextApiResponse } from "next";

export default function AccountsAPI(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return listAccounts(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// next handler to get account from query.accountId
async function listAccounts(req: NextApiRequest, res: NextApiResponse) {
  await init();

  // return all accounts from db
  const accounts = db.data?.users;

  return res.status(200).json(accounts);
}
