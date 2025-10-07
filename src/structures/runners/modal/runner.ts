import type {
    APIInteractionResponseChannelMessageWithSource,
    APIInteractionResponseLaunchActivity,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { HonoJsonResponse } from "../../../types/index.js";
import type { ModalSubmitInteraction } from "../../interactions/modal_submit_interaction.js";
import type { ModalFields, ModalFieldToType } from "./fields.js";

export type ValidModalInteractionResponse =
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseLaunchActivity;

/**
 * The callback function type for handling modal submissions.
 *
 * @param interaction - The modal submit interaction instance.
 * @param args - An object containing the values of the modal fields, typed according to their definitions.
 * @param data - A string containing any additional data associated with the modal.
 * @returns A promise that resolves to either void or a HonoJsonResponse with a valid response type.
 */
export type ModalCallback<
    E extends Env,
    Fields extends ModalFields,
    RetType extends void | HonoJsonResponse<ValidModalInteractionResponse>
> = (
    interaction: ModalSubmitInteraction<E>,
    args: {
        [K in keyof Fields]: ModalFieldToType<Fields[K]["type"]>;
    },
    data: string
) => Promise<RetType>;

/**
 * The type representing a modal runner, which can either defer the response or return it immediately.
 *
 * If `shouldDefer` is true, the callback must return void.
 *
 * If `shouldDefer` is false or not provided, the callback must return a {@link HonoJsonResponse} with a valid response type.
 *
 * Alternatively, the callback can directly return a {@link HonoJsonResponse} with a valid response type without specifying `shouldDefer`.
 */
export type ModalRunner<E extends Env, Fields extends ModalFields> =
    | {
          shouldDefer: true;
          callback: ModalCallback<E, Fields, void>;
      }
    | {
          shouldDefer?: false;
          callback: ModalCallback<
              E,
              Fields,
              HonoJsonResponse<ValidModalInteractionResponse>
          >;
      }
    | ModalCallback<E, Fields, HonoJsonResponse<ValidModalInteractionResponse>>;
