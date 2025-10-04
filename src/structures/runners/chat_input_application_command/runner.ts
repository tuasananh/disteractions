import type {
    APIInteractionResponseChannelMessageWithSource,
    APIInteractionResponseLaunchActivity,
    APIModalInteractionResponse,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { HonoJsonResponse } from "../../../types/index.js";
import type { ChatInputApplicationCommandInteraction } from "../../interactions/chat_input_application_command_interaction.js";
import type {
    ChatInputApplicationCommandArguments,
    CommandArgumentToMaybeOptionalType,
} from "./arguments.js";

type ValidChatInputInteractionResponse =
    | APIInteractionResponseChannelMessageWithSource
    | APIModalInteractionResponse
    | APIInteractionResponseLaunchActivity;

export type ChatInputApplicationCommandCallback<
    E extends Env,
    Args extends ChatInputApplicationCommandArguments,
    RetType extends void | HonoJsonResponse<ValidChatInputInteractionResponse>
> = (
    interaction: ChatInputApplicationCommandInteraction<E>,
    args: {
        [K in keyof Args]: CommandArgumentToMaybeOptionalType<
            Args[K]["type"],
            Args[K]["required"]
        >;
    }
) => Promise<RetType>;

export type ChatInputApplicationCommandRunner<
    E extends Env,
    Args extends ChatInputApplicationCommandArguments
> =
    | {
          shouldDefer: true;
          callback: ChatInputApplicationCommandCallback<E, Args, void>;
      }
    | {
          shouldDefer?: false;
          callback: ChatInputApplicationCommandCallback<
              E,
              Args,
              HonoJsonResponse<ValidChatInputInteractionResponse>
          >;
      }
    | ChatInputApplicationCommandCallback<
          E,
          Args,
          HonoJsonResponse<ValidChatInputInteractionResponse>
      >;
