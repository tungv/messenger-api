import getReqRes from "components/test-helpers/getReqRes";
import handler from "../[accountId]";

describe("/api/account/:id", () => {
  describe("GET", () => {
    it("should return account detail", async () => {
      const [req, res] = getReqRes({
        method: "GET",
        query: {
          accountId: "1",
        },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        name: "Will Smith",
      });
    });
  });
});
