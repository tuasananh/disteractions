import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const _context = {} as Context;

/**
 * A Hono Response with JSON body
 */
export type HonoJsonResponse<
    T,
    U extends ContentfulStatusCode = ContentfulStatusCode
> = ReturnType<typeof _context.json<T, U>>;
