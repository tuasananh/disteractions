import type { Env } from "hono";
import type { ChatInputCommandInteraction } from "../../interactions/chat_input_command_interaction.js";
import type {
    ChatInputCommandArguments,
    ChatInputCommandArgumentToMaybeOptionalType,
} from "./arguments.js";

export type ChatInputCommandCallback<
    E extends Env,
    Args extends ChatInputCommandArguments<E>,
    RetType extends void | Response
> = (
    interaction: ChatInputCommandInteraction<E>,
    args: {
        [K in keyof Args]: ChatInputCommandArgumentToMaybeOptionalType<
            Args[K]["type"],
            Args[K]["required"]
        >;
    }
) => Promise<RetType>;

export type ChatInputCommandRunner<
    E extends Env,
    Args extends ChatInputCommandArguments<E>
> =
    | {
          shouldDefer: true;
          callback: ChatInputCommandCallback<E, Args, void>;
      }
    | {
          shouldDefer?: false;
          callback: ChatInputCommandCallback<E, Args, Response>;
      }
    | ChatInputCommandCallback<E, Args, Response>;
