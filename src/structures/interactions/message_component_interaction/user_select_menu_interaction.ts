import type {
    APIBaseInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIMessageUserSelectInteractionData,
    ComponentType,
    InteractionType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { User } from "../../discord_objects/user.js";
import type { DisteractionContext } from "../../disteraction_context.js";
import { MessageComponentInteraction } from "./message_component_interaction.js";

export type APIUserSelectMenuInteraction =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<
            InteractionType.MessageComponent,
            APIMessageUserSelectInteractionData
        >;

export class UserSelectMenuInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIUserSelectMenuInteraction;
    declare componentType: ComponentType.UserSelect;

    values: Snowflake[];
    users: Map<Snowflake, User<E>>;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIUserSelectMenuInteraction
    ) {
        super(ctx, data);
        this.values = data.data.values;
        this.users = new Map();
        for (const [id, user] of Object.entries(data.data.resolved.users)) {
            this.users.set(id, new User(ctx, user));
        }
    }
}
