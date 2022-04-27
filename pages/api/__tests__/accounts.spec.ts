import getReqRes from "components/test-helpers/getReqRes";
import handler from "../accounts";

describe("/api/accounts", () => {
  describe("GET", () => {
    it("should return all accounts", async () => {
      const [req, res] = getReqRes({
        method: "GET",
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            id: "1",
            name: "Will Smith",
          },
          {
            id: "2",
            name: "Jada",
          },
        ])
      );
    });
  });
});
