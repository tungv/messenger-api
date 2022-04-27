import createMessage from "components/test-helpers/createMessage";
import getReqRes from "components/test-helpers/getReqRes";
import { toBase64 } from "components/toBase64";
import { Message } from "types/api";
import handler from "../messages";

describe("create new message", () => {
  it("should let create new message", async () => {
    const message = await createMessage("1", "1", "hello");

    expect(message).toEqual({
      id: expect.any(String),
      text: "hello",
      sender: {
        id: "1",
        name: "Will Smith",
      },
      createdAt: expect.any(String),
    });
  });

  describe("cursor logic", () => {
    let messages: Message[] = [];
    let oldestCursor = "";
    let newestCursor = "";

    beforeAll(async () => {
      // insert 10 messages
      const ts = Date.now();
      messages = await pMap(
        [
          ...Array(10)
            .fill(0)
            .map((_, i) => i + 1),
        ],
        async (i) => createMessage("1", "1", `test message [${ts} - ${i}]`)
      );

      messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });

    it("should return list of all messages in a conversation limit by pageSize", async () => {
      // get newest 5
      const [req, res] = getReqRes({
        method: "GET",
        query: { accountId: "1", conversationId: "1", pageSize: "5" },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      const newest5 = messages.slice(messages.length - 5).reverse();

      expect(res.json).toHaveBeenCalledWith({
        rows: newest5,
        sort: "NEWEST_FIRST",
        cursor_next: toBase64(JSON.stringify({ lastSeen: String(newest5[0].id), sort: "NEWEST_FIRST" })),
        cursor_prev: toBase64(JSON.stringify({ lastSeen: String(newest5[4].id), sort: "OLDEST_FIRST" })),
      });

      oldestCursor = res.json.mock.calls[0][0].cursor_prev;
      newestCursor = res.json.mock.calls[0][0].cursor_next;
    });

    it("should return empty if no new messages are created", async () => {
      // when no messages are created
      const [req, res] = getReqRes({
        method: "GET",
        query: { accountId: "1", conversationId: "1", pageSize: "5", cursor: newestCursor },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rows: [],
        sort: "NEWEST_FIRST",
        cursor_next: toBase64(JSON.stringify({ lastSeen: String(messages[9].id), sort: "NEWEST_FIRST" })),
        cursor_prev: toBase64(JSON.stringify({ lastSeen: String(messages[9].id), sort: "OLDEST_FIRST" })),
      });
    });

    it("should return new messages that are created after the last time", async () => {
      const m1 = await createMessage("1", "1", "hello this is newer 1");
      const m2 = await createMessage("1", "1", "hello this is newer 2");

      const [req, res] = getReqRes({
        method: "GET",
        query: { accountId: "1", conversationId: "1", pageSize: "5", cursor: newestCursor },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rows: [m2, m1],
        sort: "NEWEST_FIRST",
        cursor_next: toBase64(JSON.stringify({ lastSeen: String(m2.id), sort: "NEWEST_FIRST" })),
        cursor_prev: toBase64(JSON.stringify({ lastSeen: String(m1.id), sort: "OLDEST_FIRST" })),
      });

      newestCursor = res.json.mock.calls[0][0].cursor_next;
    });

    it("should query older messages using cursor_prev", async () => {
      const [req, res] = getReqRes({
        method: "GET",
        query: { accountId: "1", conversationId: "1", pageSize: "5", cursor: oldestCursor },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rows: messages.slice(0, 5),
        sort: "OLDEST_FIRST",
        cursor_next: toBase64(JSON.stringify({ lastSeen: String(messages[0].id), sort: "OLDEST_FIRST" })),
        cursor_prev: toBase64(JSON.stringify({ lastSeen: String(messages[4].id), sort: "NEWEST_FIRST" })),
      });
    });
  });
});

async function pMap<Input, Output>(
  input: Input[],
  fn: (input: Input, index: number) => Promise<Output>
): Promise<Output[]> {
  const output = [] as Output[];
  output.length = input.length;

  await Promise.all(
    input.map((value, index) => {
      return fn(value, index).then((result) => {
        output[index] = result;
      });
    })
  );

  return output;
}
