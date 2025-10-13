import type {
    APIUserApplicationCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { ContextMenuCommandInteraction } from "./context_menu_command_interaction.js";

export class UserContextMenuCommandInteraction<
    E extends Env
> extends ContextMenuCommandInteraction<E> {
    declare rawData: APIUserApplicationCommandInteraction;
    declare commandType: ApplicationCommandType.User;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIUserApplicationCommandInteraction
    ) {
        super(ctx, data);
    }
}
