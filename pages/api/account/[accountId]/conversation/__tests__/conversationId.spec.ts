import getReqRes from "components/test-helpers/getReqRes";
import handler from "../[conversationId]";

describe("/api/account/:id/conversation/:id", () => {
  describe("GET", () => {
    it("should return a conversation given an id", async () => {
      const [req, res] = getReqRes({
        method: "GET",
        query: { accountId: "1", conversationId: "1" },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        participants: [
          { id: "1", name: "Will Smith" },
          { id: "2", name: "Jada" },
        ],
        lastMessage: {
          id: expect.any(String),
          text: expect.any(String),
          sender: { id: "1", name: "Will Smith" },
          createdAt: expect.any(String),
        },
      });
    });
  });
});
