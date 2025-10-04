import type { APIModalSubmitInteraction } from "@discordjs/core/http-only";
import { type Env } from "hono";
import { DisteractionContext } from "../disteraction_context.js";
import { Interaction } from "./interaction.js";

export class ModalSubmitInteraction<E extends Env> extends Interaction<E> {
    data: APIModalSubmitInteraction;

    constructor(
        context: DisteractionContext<E>,
        data: APIModalSubmitInteraction
    ) {
        super(context, data);
        this.data = data;
    }

    get custom_id() {
        return this.data.data.custom_id;
    }
}
