import type {
    APIMessageApplicationCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { ContextMenuCommandInteraction } from "./context_menu_command_interaction.js";

export class MessageContextMenuCommandInteraction<
    E extends Env
> extends ContextMenuCommandInteraction<E> {
    declare rawData: APIMessageApplicationCommandInteraction;
    declare commandType: ApplicationCommandType.Message;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMessageApplicationCommandInteraction
    ) {
        super(ctx, data);
    }
}
