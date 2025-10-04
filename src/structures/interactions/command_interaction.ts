import {
    type APIApplicationCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { DisteractionContext } from "../disteraction_context.js";
import type { ChatInputApplicationCommandInteraction } from "./chat_input_application_command_interaction.js";
import { Interaction } from "./interaction.js";

export class ApplicationCommandInteraction<
    E extends Env
> extends Interaction<E> {
    data: APIApplicationCommandInteraction;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIApplicationCommandInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }

    get commandType() {
        return this.data.data.type;
    }

    get commandName() {
        return this.data.data.name;
    }

    isChatInput(): this is ChatInputApplicationCommandInteraction<E> {
        return this.commandType === ApplicationCommandType.ChatInput;
    }
}
