import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";

export function makeApiFromToken(token: string) {
    const rest = new REST({ version: "10" }).setToken(token);
    return new API(rest);
}

export type RequiredIf<T, R extends boolean | undefined> = R extends true
    ? T
    : T | undefined;

export type MakeOptionalIfUndefined<T> = {
    [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<
        T[K],
        undefined
    >;
} & {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type MakeOptionalIfAllKeysAreOptional<T> = {
    [K in keyof T as object extends T[K] ? K : never]?: Exclude<
        T[K],
        undefined
    >;
} & {
    [K in keyof T as object extends T[K] ? never : K]: T[K];
};
