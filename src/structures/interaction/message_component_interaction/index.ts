import {
    ComponentType,
    InteractionType,
    type APIMessageComponentInteraction,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Message } from "../../discord_objects/message.js";
import type { DisteractionContext } from "../../disteraction_context.js";
import { RepliableInteraction } from "../repliable_interaction.js";
export * from "./button_interaction.js";
export * from "./channel_select_menu_interaction.js";
export * from "./mentionable_select_menu_interaction.js";
export * from "./role_select_menu_interaction.js";
export * from "./string_select_menu_interaction.js";
export * from "./user_select_menu_interaction.js";

export class MessageComponentInteraction<
    E extends Env
> extends RepliableInteraction<E> {
    declare rawData: APIMessageComponentInteraction;
    declare type: InteractionType.MessageComponent;

    message: Message<E>;
    customId: string;
    componentType: ComponentType;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMessageComponentInteraction
    ) {
        super(ctx, data);
        this.message = new Message(ctx, data.message);
        this.customId = data.data.custom_id;
        this.componentType = data.data.component_type;
    }
}
