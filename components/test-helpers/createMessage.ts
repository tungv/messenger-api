import messagesAPI from "pages/api/account/[accountId]/conversation/[conversationId]/messages";
import { Message } from "types/api";
import getReqRes from "./getReqRes";

export default async function createMessage(sentBy: string, conversationId: string, text: string): Promise<Message> {
  const [req, res] = getReqRes({
    method: "POST",
    query: { accountId: sentBy, conversationId },
    body: { text },
  });

  await messagesAPI(req, res);

  expect(res.status).toHaveBeenCalledWith(201);

  const message = res.json.mock.calls[0][0];

  return message;
}
