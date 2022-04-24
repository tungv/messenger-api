import { getClient } from "components/server/supabase";
import withDefaultDb from "components/server/withDb";
import withMethods from "components/server/withMethods";
import { User } from "types/api";

export default withDefaultDb(
  withMethods({
    async GET(req, res) {
      const supabase = getClient();
      // list all accounts
      const { data, error } = await supabase.from<User>("accounts").select(`id,name`);

      if (!data) {
        console.error(error);
        res.status(500).json({ error });
        return;
      }

      res.status(200).json(data.map(fmt));
    },
  })
);

function fmt(user: User) {
  return {
    id: String(user.id),
    name: user.name,
  };
}
