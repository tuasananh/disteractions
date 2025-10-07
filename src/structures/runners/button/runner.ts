import type {
    APIInteractionResponseChannelMessageWithSource,
    APIInteractionResponseLaunchActivity,
    APIInteractionResponseUpdateMessage,
    APIModalInteractionResponse,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { HonoJsonResponse } from "../../../types/index.js";
import type { MessageComponentButtonInteraction } from "../../interactions/message_component_button_interaction.js";

export type ValidMessageButtonInteractionResponse =
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseLaunchActivity
    | APIModalInteractionResponse
    | APIInteractionResponseUpdateMessage;

export type ButtonCallback<
    E extends Env,
    RetType extends void | HonoJsonResponse<ValidMessageButtonInteractionResponse>
> = (
    interaction: MessageComponentButtonInteraction<E>,
    data: string
) => Promise<RetType>;

export type ButtonRunner<E extends Env> =
    | {
          shouldDefer: true;
          callback: ButtonCallback<E, void>;
      }
    | {
          shouldDefer?: false;
          callback: ButtonCallback<
              E,
              HonoJsonResponse<ValidMessageButtonInteractionResponse>
          >;
      }
    | ButtonCallback<
          E,
          HonoJsonResponse<ValidMessageButtonInteractionResponse>
      >;
