import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
export default function withMethods(methods: Partial<Record<HTTPMethod, NextApiHandler>>) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method as HTTPMethod;

    if (methods[method]) {
      return methods[method]?.(req, res);
    }

    res.status(405).json({ error: "Method not allowed" });
  };
}
