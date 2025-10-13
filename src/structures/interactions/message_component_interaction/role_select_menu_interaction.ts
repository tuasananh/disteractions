import type {
    APIBaseInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIMessageRoleSelectInteractionData,
    ComponentType,
    InteractionType,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Role } from "../../discord_objects/role.js";
import type { DisteractionContext } from "../../disteraction_context.js";
import { MessageComponentInteraction } from "./message_component_interaction.js";

export type APIRoleSelectMenuInteraction =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<
            InteractionType.MessageComponent,
            APIMessageRoleSelectInteractionData
        >;

export class RoleSelectMenuInteraction<
    E extends Env
> extends MessageComponentInteraction<E> {
    declare rawData: APIRoleSelectMenuInteraction;
    declare componentType: ComponentType.RoleSelect;

    values: Snowflake[];
    roles: Map<Snowflake, Role<E>>;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIRoleSelectMenuInteraction
    ) {
        super(ctx, data);
        this.values = data.data.values;
        this.roles = new Map();
        for (const [id, user] of Object.entries(data.data.resolved.roles)) {
            this.roles.set(id, new Role(ctx, user));
        }
    }
}
