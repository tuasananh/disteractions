import type { ApplicationCommandOptionType } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { RequiredIf } from "../../../utils/index.js";
import type { ApplicationCommandAutocompleteInteraction } from "../../interactions/application_command_autocomplete_interaction.js";

type CommandArgumentToType<T extends ApplicationCommandOptionType> = T extends
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
    ? number
    : T extends ApplicationCommandOptionType.String
    ? string
    : T extends ApplicationCommandOptionType.Boolean
    ? boolean
    : never;

export type CommandArgumentToMaybeOptionalType<
    T extends ApplicationCommandOptionType,
    R extends boolean | undefined
> = RequiredIf<CommandArgumentToType<T>, R>;

type SharedRequired =
    | {
          required: true;
      }
    | {
          required?: false;
      };

type SharedDescription = {
    // name: string;
    description: string;
};

type ArgumentBase<T extends ApplicationCommandOptionType> = SharedRequired &
    SharedDescription & {
        type: T;
    };

type SharedMinMax = {
    minValue?: number;
    maxValue?: number;
};

type AutocompleteCallback<E extends Env, ChoiceType> = (
    interaction: ApplicationCommandAutocompleteInteraction<E>,
    value: ChoiceType
) => Promise<{ name: string; value: ChoiceType }[]>;

type ChoiceWrapper<E extends Env, ChoiceType> =
    | {
          autocomplete: true;
          autocompleteCallback: AutocompleteCallback<E, string>;
          choices?: [];
      }
    | {
          autocomplete?: false;
          choices?: { name: string; value: ChoiceType }[];
      };

export type ChatInputApplicationCommandBooleanArgument =
    ArgumentBase<ApplicationCommandOptionType.Boolean>;

export type ChatInputApplicationCommandIntegerArgument<E extends Env> =
    ArgumentBase<ApplicationCommandOptionType.Integer> &
        SharedMinMax &
        ChoiceWrapper<E, number>;

export type ChatInputApplicationCommandStringArgument<E extends Env> =
    ArgumentBase<ApplicationCommandOptionType.String> &
        ChoiceWrapper<E, string> & {
            minLength?: number;
            maxLength?: number;
        };

export type ChatInputApplicationCommandNumberArgument<E extends Env> =
    ArgumentBase<ApplicationCommandOptionType.Number> &
        SharedMinMax &
        ChoiceWrapper<E, number>;

type ChatInputApplicationCommandArgument<E extends Env> =
    | ChatInputApplicationCommandIntegerArgument<E>
    | ChatInputApplicationCommandBooleanArgument
    | ChatInputApplicationCommandNumberArgument<E>
    | ChatInputApplicationCommandStringArgument<E>;

export type ChatInputApplicationCommandArguments<E extends Env> = Record<
    string,
    ChatInputApplicationCommandArgument<E>
>;
