import type { APIMessage } from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import type { DisteractionContext } from "../disteraction_context.js";

export class Message<E extends Env> extends Base<E> {
    data: APIMessage;

    constructor(ctx: DisteractionContext<E>, data: APIMessage) {
        super(ctx, data);
        // this.ctx = ctx;
        this.data = data;
    }
}
