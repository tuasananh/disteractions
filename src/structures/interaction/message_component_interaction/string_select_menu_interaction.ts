import type {
    APIBaseInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIMessageStringSelectInteractionData,
    ComponentType,
    InteractionType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { MessageComponentInteraction } from "./index.js";

export type APIStringSelectMenuInteraction =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<
            InteractionType.MessageComponent,
            APIMessageStringSelectInteractionData
        >;

export class StringSelectMenuInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIStringSelectMenuInteraction;
    declare componentType: ComponentType.StringSelect;

    values: string[];

    constructor(
        ctx: DisteractionContext<E>,
        data: APIStringSelectMenuInteraction
    ) {
        super(ctx, data);
        this.values = data.data.values;
    }
}
