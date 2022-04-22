import type { NextPage } from "next";
import { useRouter } from "next/router";

import AccountSelection from "./components/accounts/AccountSelection";

const Home: NextPage = () => {
  const router = useRouter();

  return <AccountSelection goConversations={(accountId) => router.push(`/conversation/${accountId}`)} />;
};

export default Home;
