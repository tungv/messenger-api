import type { NextPage } from "next";
import { useRouter } from "next/router";

import Conversations from "../components/conversations/Conversations";

const Conversation: NextPage = () => {
  const router = useRouter();
  const { accountId } = router.query;
  const id = accountId ? accountId.toString() : "";

  return id ? <Conversations goAccountSelection={() => router.push("/")} accountId={id} /> : null;
};

export default Conversation;
