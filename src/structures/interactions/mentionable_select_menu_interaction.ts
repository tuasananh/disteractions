import type {
    APIBaseInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIMessageMentionableSelectInteractionData,
    ComponentType,
    InteractionType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Role } from "../discord_objects/role.js";
import { User } from "../discord_objects/user.js";
import type { DisteractionContext } from "../disteraction_context.js";
import { MessageComponentInteraction } from "./message_component_interaction.js";

export type APIMentionableSelectMenuInteraction =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<
            InteractionType.MessageComponent,
            APIMessageMentionableSelectInteractionData
        >;

export class MentionableSelectMenuInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIMentionableSelectMenuInteraction;
    declare componentType: ComponentType.MentionableSelect;

    values: Snowflake[];
    roles: Map<Snowflake, Role<E>>;
    users: Map<Snowflake, User<E>>;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIMentionableSelectMenuInteraction
    ) {
        super(ctx, data);
        this.values = data.data.values;
        this.roles = new Map();
        const { roles, users } = data.data.resolved;

        this.roles = new Map();
        this.users = new Map();

        if (roles) {
            for (const [id, user] of Object.entries(roles)) {
                this.roles.set(id, new Role(ctx, user));
            }
        }

        if (users) {
            for (const [id, user] of Object.entries(users)) {
                this.users.set(id, new User(ctx, user));
            }
        }
    }
}
