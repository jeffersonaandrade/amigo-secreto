import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../../server/routers";
import { createContextNext } from "../../../../../server/_core/context-next";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const headers = Object.fromEntries(req.headers.entries());
      return createContextNext(headers);
    },
  });

export { handler as GET, handler as POST };

