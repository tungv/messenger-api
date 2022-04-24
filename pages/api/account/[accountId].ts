import { getClient } from "components/server/supabase";
import withDefaultDb from "components/server/withDb";
import withMethods from "components/server/withMethods";
import { User } from "types/api";

export default withDefaultDb(
  withMethods({
    async GET(req, res) {
      const accountId = req.query.accountId as string;
      const supabase = getClient();

      const { data, error } = await supabase.from<User>("accounts").select(`id,name`).eq("id", accountId).single();

      if (!data) {
        console.log(error);
        res.status(500).json({ error });
        return;
      }

      res.status(200).json(fmt(data));
    },
  })
);

function fmt(user: User) {
  return {
    id: String(user.id),
    name: user.name,
  };
}
