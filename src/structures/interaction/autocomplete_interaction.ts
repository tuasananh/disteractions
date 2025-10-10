import {
    InteractionResponseType,
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandAutocompleteResponse,
    type ApplicationCommandType,
    type InteractionType,
    type LocalizationMap,
    type Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../disteraction_context.js";
import { BaseInteraction } from "./index.js";

export type ApplicationCommandOptionChoiceData<
    Value extends number | string = number | string
> = {
    name: string;
    nameLocalizations?: LocalizationMap | null;
    value: Value;
};
/**
 * Represents an autocomplete interaction.
 */
export class AutocompleteInteraction<E extends Env> extends BaseInteraction<E> {
    declare rawData: APIApplicationCommandAutocompleteInteraction;
    declare type: InteractionType.ApplicationCommandAutocomplete;

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
     * The options passed to the command
     */
    options: APIApplicationCommandAutocompleteInteraction["data"]["options"];

    /**
     * Creates a new AutocompleteInteraction instance.
     *
     * @param ctx - The disteraction context
     * @param data - The raw Discord API interaction data
     */
    constructor(
        ctx: DisteractionContext<E>,
        data: APIApplicationCommandAutocompleteInteraction
    ) {
        super(ctx, data);

        this.commandId = data.data.id;

        this.commandName = data.data.name;

        this.commandType = data.data.type;

        this.commandGuildId = data.data.guild_id ?? null;

        this.options = data.data.options;
    }

    /**
     * Sends results for the autocomplete of this interaction.
     *
     * @param choices - The options for the autocomplete
     */
    jsonRespond(choices: ApplicationCommandOptionChoiceData[]): Response {
        return this.ctx.hono.json<APIApplicationCommandAutocompleteResponse>({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: choices.map(({ nameLocalizations, ...option }) => ({
                    name: option.name,
                    value: option.value,
                    ...(nameLocalizations !== undefined && {
                        name_localizations: nameLocalizations,
                    }),
                })),
            },
        });
    }
}
