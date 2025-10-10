import type { APIGuild } from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import type { DisteractionContext } from "../disteraction_context.js";

export class Guild<E extends Env> extends Base<E> {
    declare rawData: APIGuild;

    constructor(ctx: DisteractionContext<E>, data: APIGuild) {
        super(ctx, data);
    }
}
