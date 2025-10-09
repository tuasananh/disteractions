import type { Env } from "hono";
import type { ButtonInteraction } from "../../interactions/button_interaction.js";

export type ButtonCallback<E extends Env, RetType extends void | Response> = (
    interaction: ButtonInteraction<E>,
    data: string
) => Promise<RetType>;

export type ButtonRunner<E extends Env> =
    | {
          shouldDefer: true;
          callback: ButtonCallback<E, void>;
      }
    | {
          shouldDefer?: false;
          callback: ButtonCallback<E, Response>;
      }
    | ButtonCallback<E, Response>;
