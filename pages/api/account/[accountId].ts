import { getAccountById, init } from "data/repository";
import { NextApiRequest, NextApiResponse } from "next";

export default function AccountAPI(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getAccount(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// next handler to get account from query.accountId
async function getAccount(req: NextApiRequest, res: NextApiResponse) {
  await init();

  const accountId = req.query.accountId as string;
  const account = await getAccountById(accountId);

  return res.status(200).json(account);
}
