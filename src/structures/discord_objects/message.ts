import type { APIMessage } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";

export class Message<E extends Env> {
    ctx: DisteractionContext<E>;
    data: APIMessage;

    constructor(ctx: DisteractionContext<E>, data: APIMessage) {
        this.ctx = ctx;
        this.data = data;
    }
}
