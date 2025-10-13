/**
 * Type definitions for Discord slash command arguments with full type safety.
 *
 * This module provides comprehensive TypeScript types for defining command arguments
 * with support for different data types, validation constraints, autocomplete functionality,
 * and conditional required/optional behavior.
 */

import type { ApplicationCommandOptionType } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { RequiredIf } from "../../../utils/index.js";
import type { AutocompleteInteraction } from "../../interactions/autocomplete_interaction.js";

/**
 * Maps Discord application command option types to their corresponding TypeScript types.
 *
 * This utility type ensures type safety when working with command argument values.
 */
export type ChatInputCommandArgumentToType<
    T extends ApplicationCommandOptionType
> = T extends
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
    ? number
    : T extends ApplicationCommandOptionType.String
    ? string
    : T extends ApplicationCommandOptionType.Boolean
    ? boolean
    : never;

/**
 * Conditionally makes a command argument type required or optional.
 *
 * This type uses the {@link RequiredIf} utility to determine if an argument
 * should be required based on the `required` flag in the argument definition.
 *
 * @example
 * ```typescript
 * // Required string argument
 * type RequiredArg = CommandArgumentToMaybeOptionalType<ApplicationCommandOptionType.String, true>;
 * // Result: string
 *
 * // Optional string argument
 * type OptionalArg = CommandArgumentToMaybeOptionalType<ApplicationCommandOptionType.String, false>;
 * // Result: string | undefined
 * ```
 */
export type ChatInputCommandArgumentToMaybeOptionalType<
    T extends ApplicationCommandOptionType,
    R extends boolean | undefined
> = RequiredIf<ChatInputCommandArgumentToType<T>, R>;

/**
 * Union type for defining whether an argument is required or optional.
 *
 * This ensures type safety at compile time for the required property.
 */
export type ChatInputCommandArgumentSharedRequired =
    | {
          /**
           * Whether this argument is required or not. Defaults to `false`.
           *
           * When set to `true`, users must provide this argument when using the command.
           */
          required: true;
      }
    | {
          /**
           * Whether this argument is required or not. Defaults to `false`.
           *
           * When `false` or omitted, users can optionally provide this argument.
           */
          required?: false;
      };

/**
 * Shared description property for all argument types.
 */
export type ChatInputCommandArgumentSharedDescription = {
    /**
     * The description of the argument. Between 1 and 100 characters.
     *
     * This description is shown to users in the Discord client when they
     * are typing the command, helping them understand what the argument is for.
     */
    description: string;
};

/**
 * Base properties shared by all command argument types.
 *
 * Combines required status, description, and the specific option type.
 */
export type ChatInputCommandArgumentBase<
    T extends ApplicationCommandOptionType
> = ChatInputCommandArgumentSharedRequired &
    ChatInputCommandArgumentSharedDescription & {
        /**
         * The Discord application command option type.
         *
         * Determines the data type and validation behavior for this argument.
         */
        type: T;
    };

/**
 * Shared minimum and maximum value constraints for numeric arguments.
 *
 * Used by both integer and number argument types to define valid ranges.
 */
export type ChatInputCommandArgumentSharedMinMax = {
    /**
     * The minimum value for the argument.
     *
     * If specified, Discord will reject values below this threshold.
     */
    minValue?: number;
    /**
     * The maximum value for the argument.
     *
     * If specified, Discord will reject values above this threshold.
     */
    maxValue?: number;
};

/**
 * Callback function type for providing autocomplete suggestions.
 *
 * This function is called when users are typing in an argument field
 * that has autocomplete enabled. It should return suggestions based on
 * the current input value.
 *
 * @example
 * ```typescript
 * const autocompleteCallback: AutocompleteCallback<Env, string> = async (interaction, value) => {
 *   const suggestions = await searchDatabase(value);
 *   return suggestions.map(item => ({ name: item.displayName, value: item.id }));
 * };
 * ```
 */
export type ChatInputCommandArgumentAutocompleteCallback<
    E extends Env,
    ChoiceType
> = (
    /**
     * The autocomplete interaction that triggered this callback.
     *
     * Provides access to the context and user information.
     */
    interaction: AutocompleteInteraction<E>,
    /**
     * The current value of the argument being autocompleted.
     *
     * This is what the user has typed so far, which can be used
     * to filter or search for relevant suggestions.
     */
    value: string
) => Promise<{ name: string; value: ChoiceType }[]>;

/**
 * Wrapper type for handling choices and autocomplete functionality.
 *
 * Arguments can either have predefined choices OR autocomplete functionality,
 * but not both simultaneously. This type enforces that constraint.
 */
export type ChatInputCommandArgumentChoiceWrapper<E extends Env, ChoiceType> =
    | {
          /**
           * Whether this argument supports autocomplete. Defaults to `false`.
           *
           * When enabled, Discord will call the autocomplete callback as users type,
           * allowing for dynamic suggestion generation.
           */
          autocomplete: true;
          /**
           * The callback function to be called when the user is typing in the argument.
           *
           * This function should return an array of suggestions based on the current input.
           */
          autocompleteCallback: ChatInputCommandArgumentAutocompleteCallback<
              E,
              ChoiceType
          >;
          /** Choices are not allowed when autocomplete is enabled */
          choices?: [];
      }
    | {
          /**
           * Whether this argument supports autocomplete. Defaults to `false`.
           *
           * When disabled, the argument can use predefined choices instead.
           */
          autocomplete?: false;
          /**
           * Predefined choices for this argument.
           *
           * Users will see these options in a dropdown when using the command.
           * Maximum of 25 choices allowed.
           */
          choices?: { name: string; value: ChoiceType }[];
      };

/**
 * Boolean argument type for slash commands.
 *
 * Represents a true/false argument that users can toggle.
 * Boolean arguments don't support choices or autocomplete.
 *
 * @example
 * ```typescript
 * const arg: ChatInputCommandBooleanArgument = {
 *   type: ApplicationCommandOptionType.Boolean,
 *   description: "Enable notifications",
 *   required: true
 * };
 * ```
 */
export type ChatInputCommandBooleanArgument =
    ChatInputCommandArgumentBase<ApplicationCommandOptionType.Boolean>;

/**
 * Integer argument type for slash commands.
 *
 * Represents a whole number input with optional min/max constraints,
 * choices, or autocomplete functionality.
 *
 * @example
 * ```typescript
 * const arg: ChatInputCommandIntegerArgument<Env> = {
 *   type: ApplicationCommandOptionType.Integer,
 *   description: "Number of items",
 *   required: true,
 *   minValue: 1,
 *   maxValue: 100
 * };
 * ```
 */
export type ChatInputCommandIntegerArgument<E extends Env> =
    ChatInputCommandArgumentBase<ApplicationCommandOptionType.Integer> &
        ChatInputCommandArgumentSharedMinMax &
        ChatInputCommandArgumentChoiceWrapper<E, number>;

/**
 * String argument type for slash commands.
 *
 * Represents text input with optional length constraints,
 * choices, or autocomplete functionality.
 *
 * @example
 * ```typescript
 * const arg: ChatInputCommandStringArgument<Env> = {
 *   type: ApplicationCommandOptionType.String,
 *   description: "User's name",
 *   required: true,
 *   minLength: 1,
 *   maxLength: 50
 * };
 * ```
 */
export type ChatInputCommandStringArgument<E extends Env> =
    ChatInputCommandArgumentBase<ApplicationCommandOptionType.String> &
        ChatInputCommandArgumentChoiceWrapper<E, string> & {
            /**
             * The minimum length for string values.
             *
             * If specified, Discord will reject strings shorter than this.
             */
            minLength?: number;
            /**
             * The maximum length for string values.
             *
             * If specified, Discord will reject strings longer than this.
             */
            maxLength?: number;
        };

/**
 * Number (decimal) argument type for slash commands.
 *
 * Represents a floating-point number input with optional min/max constraints,
 * choices, or autocomplete functionality.
 *
 * @example
 * ```typescript
 * const arg: ChatInputCommandNumberArgument<Env> = {
 *   type: ApplicationCommandOptionType.Number,
 *   description: "Price in USD",
 *   required: true,
 *   minValue: 0.01,
 *   maxValue: 999.99
 * };
 * ```
 */
export type ChatInputCommandNumberArgument<E extends Env> =
    ChatInputCommandArgumentBase<ApplicationCommandOptionType.Number> &
        ChatInputCommandArgumentSharedMinMax &
        ChatInputCommandArgumentChoiceWrapper<E, number>;

/**
 * Union type representing any valid command argument.
 *
 * This type encompasses all supported argument types for slash commands.
 */
export type ChatInputCommandArgument<E extends Env> =
    | ChatInputCommandIntegerArgument<E>
    | ChatInputCommandBooleanArgument
    | ChatInputCommandNumberArgument<E>
    | ChatInputCommandStringArgument<E>;

/**
 * Type definition for the complete set of arguments for a slash command.
 *
 * This is a record where keys are argument names and values are argument definitions.
 * The framework uses this type to provide type-safe argument access in command runners.
 *
 * @example
 * ```typescript
 * const arguments: ChatInputCommandArguments<Env> = {
 *   user: {
 *     type: ApplicationCommandOptionType.User,
 *     description: "Target user",
 *     required: true
 *   },
 *   reason: {
 *     type: ApplicationCommandOptionType.String,
 *     description: "Reason for action",
 *     required: false
 *   }
 * };
 * ```
 */
export type ChatInputCommandArguments<E extends Env> = Record<
    string,
    ChatInputCommandArgument<E>
>;
