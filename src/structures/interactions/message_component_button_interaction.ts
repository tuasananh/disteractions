import type { APIMessageComponentButtonInteraction } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";
import { MessageComponentInteraction } from "./message_component_interaction.js";

export class MessageComponentButtonInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    data: APIMessageComponentButtonInteraction;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMessageComponentButtonInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }

    get custom_id() {
        return this.data.data.custom_id;
    }
}
