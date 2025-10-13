import type {
    APIBaseInteraction,
    APIInteractionDataResolvedChannel,
    APIMessageChannelSelectInteractionData,
    APIMessageComponentSelectMenuInteraction,
    ComponentType,
    InteractionType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { MessageComponentInteraction } from "./message_component_interaction.js";

export type APIChannelSelectMenuInteraction =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<
            InteractionType.MessageComponent,
            APIMessageChannelSelectInteractionData
        >;

export class ChannelSelectMenuInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIChannelSelectMenuInteraction;
    declare componentType: ComponentType.ChannelSelect;

    values: Snowflake[];
    channels: Map<Snowflake, APIInteractionDataResolvedChannel>;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIChannelSelectMenuInteraction
    ) {
        super(ctx, data);
        this.values = data.data.values;
        this.channels = new Map();
        for (const [id, channel] of Object.entries(
            data.data.resolved.channels
        )) {
            this.channels.set(id, channel);
        }
    }
}
