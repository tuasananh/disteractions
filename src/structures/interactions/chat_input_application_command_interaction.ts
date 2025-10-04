import type { APIChatInputApplicationCommandInteraction } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";
import { ApplicationCommandInteraction } from "./command_interaction.js";

export class ChatInputApplicationCommandInteraction<
    E extends Env
> extends ApplicationCommandInteraction<E> {
    data: APIChatInputApplicationCommandInteraction;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIChatInputApplicationCommandInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }
}
