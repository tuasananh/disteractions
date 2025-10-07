import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";

/**
 * Creates a new Discord API client instance from a bot token.
 *
 * This utility function sets up a REST client with the Discord API v10
 * and returns a fully configured API instance that can be used to make
 * Discord API calls.
 *
 * @param token - The Discord bot token for authentication
 * @returns A configured {@link API} instance ready for Discord API calls
 *
 * @example
 * ```typescript
 * const api = makeApiFromToken(process.env.DISCORD_TOKEN!);
 * const guild = await api.guilds.get('123456789');
 * ```
 */
export function makeApiFromToken(token: string) {
    const rest = new REST({ version: "10" }).setToken(token);
    return new API(rest);
}

/**
 * Conditionally makes a type required or optional based on a boolean flag.
 *
 * This utility type is used throughout the framework to make properties
 * required when a condition is true, and optional when it's false or undefined.
 *
 * @example
 * ```typescript
 * type ExampleType<R extends boolean> = {
 *   name: RequiredIf<string, R>;
 * };
 *
 * // When R is true, name is required
 * const required: ExampleType<true> = { name: "test" };
 *
 * // When R is false/undefined, name is optional
 * const optional: ExampleType<false> = {}; // Valid
 * ```
 */
export type RequiredIf<T, R extends boolean | undefined> = R extends true
    ? T
    : T | undefined;

/**
 * Makes properties optional if they can be undefined, keeps others required.
 *
 * This type helper automatically determines which properties should be optional
 * in an object type based on whether they can accept undefined values.
 *
 * @example
 * ```typescript
 * type Original = {
 *   required: string;
 *   optional: string | undefined;
 * };
 *
 * type Result = MakeOptionalIfUndefined<Original>;
 * // Result: { required: string; optional?: string; }
 * ```
 */
export type MakeOptionalIfUndefined<T> = {
    [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<
        T[K],
        undefined
    >;
} & {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

/**
 * Makes properties optional if all their keys are already optional.
 *
 * This advanced utility type helps with complex object transformations
 * where nested objects might have all optional keys.
 *
 * @example
 * ```typescript
 * type NestedOptional = {
 *   nested?: {
 *     a?: string;
 *     b?: number;
 *   };
 * };
 *
 * type Result = MakeOptionalIfAllKeysAreOptional<NestedOptional>;
 * // Makes the entire nested object optional if all its keys are optional
 * ```
 */
export type MakeOptionalIfAllKeysAreOptional<T> = {
    [K in keyof T as object extends T[K] ? K : never]?: Exclude<
        T[K],
        undefined
    >;
} & {
    [K in keyof T as object extends T[K] ? never : K]: T[K];
};

export type OptionalKeys<T> = {
    [K in keyof T]?: T[K];
};
