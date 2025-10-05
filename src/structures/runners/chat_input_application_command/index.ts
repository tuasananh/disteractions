import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    InteractionContextType,
    type APIApplicationCommandIntegerOptionBase,
    type APIApplicationCommandNumberOptionBase,
    type APIApplicationCommandOption,
    type APIApplicationCommandStringOptionBase,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { ChatInputApplicationCommandArguments } from "./arguments.js";
import type { ChatInputApplicationCommandRunner } from "./runner.js";
export * from "./arguments.js";
export * from "./runner.js";

export type ChatInputApplicationCommandOptions<
    E extends Env,
    Args extends ChatInputApplicationCommandArguments<E>
> = {
    name: string;
    description: string;
    contexts?: InteractionContextType[];
    nsfw?: boolean;
    arguments?: Args;
    ownerOnly?: boolean;
    runner: ChatInputApplicationCommandRunner<E, Args>;
};

export class ChatInputApplicationCommand<
    E extends Env,
    Args extends ChatInputApplicationCommandArguments<E> = ChatInputApplicationCommandArguments<E>
> implements ChatInputApplicationCommandOptions<E, Args>
{
    readonly name: string;
    readonly description: string;
    readonly contexts?: InteractionContextType[];
    readonly nsfw?: boolean;
    readonly arguments?: Args;
    readonly ownerOnly?: boolean;
    readonly runner: ChatInputApplicationCommandRunner<E, Args>;

    constructor(opts: ChatInputApplicationCommandOptions<E, Args>) {
        this.name = opts.name;
        this.description = opts.description;
        if (opts.arguments) this.arguments = opts.arguments;
        if (opts.contexts) this.contexts = opts.contexts;
        if (opts.nsfw) this.nsfw = opts.nsfw;
        if (opts.ownerOnly) this.ownerOnly = opts.ownerOnly;
        this.runner = opts.runner;
    }

    private getBaseOption<T extends ApplicationCommandOptionType>(
        name: string,
        option: { description: string; type: T; required?: boolean }
    ) {
        return {
            name: name,
            description: option.description,
            type: option.type,
            ...(option.required !== undefined && { required: option.required }),
        };
    }

    private addMinMax<T extends { min_value?: number; max_value?: number }>(
        self: T,
        option: { minValue?: number; maxValue?: number }
    ) {
        if (option.minValue !== undefined) self.min_value = option.minValue;
        if (option.maxValue !== undefined) self.max_value = option.maxValue;
    }

    toAPI(): RESTPostAPIApplicationCommandsJSONBody {
        return {
            type: ApplicationCommandType.ChatInput,
            name: this.name,
            description: this.description,
            contexts: this.contexts,
            nsfw: this.nsfw,
            ...(this.arguments !== undefined && {
                options: Object.entries(this.arguments).map(
                    ([name, option]): APIApplicationCommandOption => {
                        switch (option.type) {
                            case ApplicationCommandOptionType.String: {
                                const stringOption: APIApplicationCommandStringOptionBase =
                                    this.getBaseOption(name, option);
                                if (option.minLength !== undefined)
                                    stringOption.min_length = option.minLength;
                                if (option.maxLength !== undefined)
                                    stringOption.max_length = option.maxLength;

                                if (option.autocomplete) {
                                    return {
                                        ...stringOption,
                                        autocomplete: true,
                                    };
                                } else {
                                    return {
                                        ...stringOption,
                                        ...(option.choices !== undefined && {
                                            choices: option.choices,
                                        }),
                                    };
                                }
                            }
                            case ApplicationCommandOptionType.Integer: {
                                const integerOption: APIApplicationCommandIntegerOptionBase =
                                    this.getBaseOption(name, option);
                                this.addMinMax(integerOption, option);
                                if (option.autocomplete) {
                                    return {
                                        ...integerOption,
                                        autocomplete: true,
                                    };
                                } else {
                                    return {
                                        ...integerOption,
                                        ...(option.choices !== undefined && {
                                            choices: option.choices,
                                        }),
                                    };
                                }
                            }
                            case ApplicationCommandOptionType.Number: {
                                const numberOption: APIApplicationCommandNumberOptionBase =
                                    this.getBaseOption(name, option);
                                this.addMinMax(numberOption, option);
                                if (option.autocomplete) {
                                    return {
                                        ...numberOption,
                                        autocomplete: true,
                                    };
                                } else {
                                    return {
                                        ...numberOption,
                                        ...(option.choices !== undefined && {
                                            choices: option.choices,
                                        }),
                                    };
                                }
                            }
                            case ApplicationCommandOptionType.Boolean:
                                return this.getBaseOption(name, option);
                        }
                    }
                ),
            }),
        };
    }
}
