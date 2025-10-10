import type { APIChannel } from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import type { DisteractionContext } from "../disteraction_context.js";

export class BaseChannel<E extends Env> extends Base<E> {
    declare rawData: APIChannel;

    constructor(ctx: DisteractionContext<E>, data: APIChannel) {
        super(ctx, data);
    }
}
