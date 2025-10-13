import type {
    APIContextMenuInteraction,
    ApplicationCommandType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { CommandInteraction } from "./command_interaction.js";

export class ContextMenuCommandInteraction<
    E extends Env
> extends CommandInteraction<E> {
    declare rawData: APIContextMenuInteraction;
    declare commandType:
        | ApplicationCommandType.Message
        | ApplicationCommandType.User;
    targetId: Snowflake;

    constructor(ctx: DisteractionContext<E>, data: APIContextMenuInteraction) {
        super(ctx, data);
        this.targetId = data.data.target_id;
    }
}
