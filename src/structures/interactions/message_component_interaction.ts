import {
    ComponentType,
    type APIMessageComponentInteraction,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";
import { Interaction } from "./interaction.js";
import type { MessageComponentButtonInteraction } from "./message_component_button_interaction.js";

export class MessageComponentInteraction<E extends Env> extends Interaction<E> {
    data: APIMessageComponentInteraction;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMessageComponentInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }

    isButton(): this is MessageComponentButtonInteraction<E> {
        return this.data.data.component_type === ComponentType.Button;
    }
}
