import type { Snowflake } from "@discordjs/core/http-only";
import { DiscordSnowflake } from "@sapphire/snowflake";
import type { Env } from "hono";
import type { DisteractionContext } from "./disteraction_context.js";

export class Base<E extends Env> {
    ctx: DisteractionContext<E>;
    rawData: { id: Snowflake };
    id: Snowflake;

    constructor(ctx: DisteractionContext<E>, data: { id: Snowflake }) {
        this.ctx = ctx;
        this.rawData = data;
        this.id = data.id;
    }

    valueOf() {
        return this.id;
    }

    get createdTimestamp() {
        return DiscordSnowflake.timestampFrom(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }
}
