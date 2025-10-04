import type { ApplicationCommandOptionType } from "@discordjs/core/http-only";
import type { RequiredIf } from "../../../utils/index.js";

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

type ChoiceWrapper<ChoiceType> =
    | {
          autocomplete: true;
          choices?: [];
      }
    | {
          autocomplete?: false;
          choices?: { name: string; value: ChoiceType }[];
      };

export type ChatInputApplicationCommandBooleanArgument =
    ArgumentBase<ApplicationCommandOptionType.Boolean>;

export type ChatInputApplicationCommandIntegerArgument =
    ArgumentBase<ApplicationCommandOptionType.Integer> &
        SharedMinMax &
        ChoiceWrapper<number>;

export type ChatInputApplicationCommandStringArgument =
    ArgumentBase<ApplicationCommandOptionType.String> &
        ChoiceWrapper<string> & {
            minLength?: number;
            maxLength?: number;
        };

export type ChatInputApplicationCommandNumberArgument =
    ArgumentBase<ApplicationCommandOptionType.Number> &
        SharedMinMax &
        ChoiceWrapper<number>;

type ChatInputApplicationCommandArgument =
    | ChatInputApplicationCommandIntegerArgument
    | ChatInputApplicationCommandBooleanArgument
    | ChatInputApplicationCommandNumberArgument
    | ChatInputApplicationCommandStringArgument;

export type ChatInputApplicationCommandArguments = Record<
    string,
    ChatInputApplicationCommandArgument
>;
