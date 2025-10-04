import type { APIUser } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";

export class User<E extends Env> {
    ctx: DisteractionContext<E>;
    data: APIUser;

    constructor(ctx: DisteractionContext<E>, data: APIUser) {
        this.ctx = ctx;
        this.data = data;
    }

    get id() {
        return this.data.id;
    }
}
