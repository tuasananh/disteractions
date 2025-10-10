import type {
    APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { CommandInteraction } from "./index.js";

export class ChatInputCommandInteraction<
    E extends Env
> extends CommandInteraction<E> {
    declare rawData: APIChatInputApplicationCommandInteraction;
    declare commandType: ApplicationCommandType.ChatInput;

    options:
        | APIChatInputApplicationCommandInteraction["data"]["options"]
        | null;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIChatInputApplicationCommandInteraction
    ) {
        super(ctx, data);

        this.options = data.data.options ?? null;
    }
}
