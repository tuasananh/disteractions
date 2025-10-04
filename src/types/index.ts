import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const _context = {} as Context;

export type HonoJsonResponse<
    T,
    U extends ContentfulStatusCode = ContentfulStatusCode
> = ReturnType<typeof _context.json<T, U>>;
