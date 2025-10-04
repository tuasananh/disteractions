import type {
    APIInteractionResponseChannelMessageWithSource,
    APIInteractionResponseLaunchActivity,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { HonoJsonResponse } from "../../../types/index.js";
import type { ModalSubmitInteraction } from "../../interactions/modal_submit_interaction.js";
import type { ModalFields, ModalFieldToType } from "./fields.js";

type ValidResponse =
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseLaunchActivity;

export type ModalCallback<
    E extends Env,
    Fields extends ModalFields,
    RetType extends void | HonoJsonResponse<ValidResponse>
> = (
    interaction: ModalSubmitInteraction<E>,
    args: {
        [K in keyof Fields]: ModalFieldToType<Fields[K]["type"]>;
    }
) => Promise<RetType>;

export type ModalRunner<E extends Env, Fields extends ModalFields> =
    | {
          shouldDefer: true;
          callback: ModalCallback<E, Fields, void>;
      }
    | {
          shouldDefer?: false;
          callback: ModalCallback<E, Fields, HonoJsonResponse<ValidResponse>>;
      }
    | ModalCallback<E, Fields, HonoJsonResponse<ValidResponse>>;
