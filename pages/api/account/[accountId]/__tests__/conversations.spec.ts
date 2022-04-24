import getReqRes from "components/test-helpers/getReqRes";
import handler from "../conversations";

describe("/api/account/:id/conversations", () => {
  describe("POST", () => {
    it("should allow creating new conversation", async () => {
      const [req, res] = getReqRes({
        method: "POST",
        query: {
          accountId: "1",
          with: "2",
        },
      });

      await handler(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: expect.any(String),
        participants: [
          { id: "1", name: "Will Smith" },
          { id: "2", name: "Jada" },
        ],
        lastMessage: expect.any(Object),
      });
    });

    it("should return the same conversation if already exists", async () => {
      const [req, res] = getReqRes({
        method: "POST",
        query: {
          accountId: "2",
          with: "1",
        },
      });

      await handler(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: expect.any(String),
        participants: [
          { id: "1", name: "Will Smith" },
          { id: "2", name: "Jada" },
        ],
        lastMessage: expect.any(Object),
      });
    });
  });
});
