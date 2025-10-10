import type {
    APIApplicationCommandInteraction,
    ApplicationCommandType,
    InteractionType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { DisteractionsError } from "../../../errors/disteraction_error.js";
import { ErrorCodes } from "../../../errors/error_codes.js";
import type { DisteractionContext } from "../../disteraction_context.js";
import { RepliableInteraction } from "../repliable_interaction.js";
export * from "./chat_input_command_interaction.js";
export * from "./context_menu_command_interaction.js";
export * from "./message_context_menu_interaction.js";
export * from "./primary_entry_point_command_interaction.js";
export * from "./user_context_menu_command_interaction.js";

/**
 * Represents a command interaction.
 */
export class CommandInteraction<E extends Env> extends RepliableInteraction<E> {
    declare rawData: APIApplicationCommandInteraction;
    declare type: InteractionType.ApplicationCommand;

    /**
     * The invoked application command's id
     */
    commandId: Snowflake;

    /**
     * The invoked application command's name
     */
    commandName: string;

    /**
     * The invoked application command's type
     */
    commandType: ApplicationCommandType;

    /**
     * The id of the guild the invoked application command is registered to
     */
    commandGuildId: Snowflake | null;

    /**
     * Creates a new CommandInteraction instance.
     *
     * @param ctx - The disteraction context
     * @param data - The raw Discord API interaction data
     */
    constructor(
        ctx: DisteractionContext<E>,
        data: APIApplicationCommandInteraction
    ) {
        super(ctx, data);

        this.commandId = data.data.id;

        this.commandName = data.data.name;

        this.commandType = data.data.type;

        this.commandGuildId = data.data.guild_id ?? null;
    }

    /**
     * @deprecated Command interactions cannot use jsonDeferUpdate, maybe you meant to use jsonDeferReply.
     */
    override jsonDeferUpdate(): Response {
        throw new DisteractionsError(
            ErrorCodes.CommandInteractionCannotDeferUpdate
        );
    }

    /**
     * @deprecated Command interactions cannot use jsonUpdate, maybe you meant to use jsonReply.
     */
    override jsonUpdate(): Response {
        throw new DisteractionsError(ErrorCodes.CommandInteractionCannotUpdate);
    }
}
