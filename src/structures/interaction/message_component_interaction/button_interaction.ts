import type {
    APIMessageComponentButtonInteraction,
    ComponentType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { MessageComponentInteraction } from "./index.js";

export class ButtonInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIMessageComponentButtonInteraction;
    declare componentType: ComponentType.Button;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMessageComponentButtonInteraction
    ) {
        super(ctx, data);
    }
}
