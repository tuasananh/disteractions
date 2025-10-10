import type { Env } from "hono";
import type { ModalSubmitInteraction } from "../../interaction/modal_submit_interaction.js";
import type { ModalFields, ModalFieldToType } from "./fields.js";

export type ModalCallback<
    E extends Env,
    Fields extends ModalFields,
    RetType extends void | Response
> = (
    interaction: ModalSubmitInteraction<E>,
    args: {
        [K in keyof Fields]: ModalFieldToType<Fields[K]["type"]>;
    },
    data: string
) => Promise<RetType>;

export type ModalRunner<E extends Env, Fields extends ModalFields> =
    | {
          shouldDefer: true;
          callback: ModalCallback<E, Fields, void>;
      }
    | {
          shouldDefer?: false;
          callback: ModalCallback<E, Fields, Response>;
      }
    | ModalCallback<E, Fields, Response>;
