import type {
    APIRole,
    Permissions,
    RoleFlags,
    Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import type { DisteractionContext } from "../disteraction_context.js";

/**
 * Role color configuration.
 */
export type RoleColors = {
    /** The primary color of the role */
    primaryColor: number;
    /**
     * The secondary color of the role.
     * This will make the role a gradient between the other provided colors.
     */
    secondaryColor: number | null;
    /**
     * The tertiary color of the role.
     * When sending `tertiaryColor` the API enforces the role color to be a holographic style with values of
     * `primaryColor = 11127295`, `secondaryColor = 16759788`, and `tertiaryColor = 16761760`.
     */
    tertiaryColor: number | null;
};

export type RoleTags = {
    /**
     * The id of the bot this role belongs to
     */
    botId: Snowflake | null;
    /**
     * Whether this is the guild's premium subscriber role
     */
    premiumSubscriber: true | null;
    /**
     * The id of the integration this role belongs to
     */
    integrationId: Snowflake | null;
    /**
     * The id of this role's subscription sku and listing
     */
    subscriptionListingId: Snowflake | null;
    /**
     * Whether this role is available for purchase
     */
    availableForPurchase: true | null;
    /**
     * Whether this role is a guild's linked role
     */
    guildConnections: true | null;
};

export class Role<E extends Env> extends Base<E> {
    declare rawData: APIRole;

    /**
     * Role name
     */
    name: string;
    /**
     * Integer representation of hexadecimal color code
     *
     * @remarks `color` will still be returned by the API, but using the `colors` field is recommended when doing requests.
     */
    color: number;
    /**
     * The role's colors
     */
    colors: RoleColors | null;
    /**
     * If this role is pinned in the user listing
     */
    hoist: boolean;
    /**
     * The role icon hash
     */
    icon: string | null;
    /**
     * The role unicode emoji as a standard emoji
     */
    unicodeEmoji: string | null;
    /**
     * Position of this role
     */
    position: number;
    /**
     * Permission bit set
     *
     * @see {@link https://en.wikipedia.org/wiki/Bit_field}
     */
    permissions: Permissions;
    /**
     * Whether this role is managed by an integration
     */
    managed: boolean;
    /**
     * Whether this role is mentionable
     */
    mentionable: boolean;
    /**
     * The tags this role has
     */
    tags: RoleTags | null;
    /**
     * Role flags
     */
    flags: RoleFlags;

    constructor(ctx: DisteractionContext<E>, data: APIRole) {
        super(ctx, data);
        this.name = data.name;
        this.color = data.color;
        this.colors = data.colors
            ? {
                  primaryColor: data.colors.primary_color,
                  secondaryColor: data.colors.secondary_color,
                  tertiaryColor: data.colors.tertiary_color,
              }
            : null;
        this.hoist = data.hoist;
        this.icon = data.icon ?? null;
        this.unicodeEmoji = data.unicode_emoji ?? null;
        this.position = data.position;
        this.permissions = data.permissions;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.flags = data.flags;

        this.tags = data.tags
            ? {
                  botId: data.tags.bot_id ?? null,
                  integrationId: data.tags.integration_id ?? null,
                  premiumSubscriber:
                      "premium_subscriber" in data.tags ? true : null,
                  subscriptionListingId:
                      data.tags.subscription_listing_id ?? null,
                  availableForPurchase:
                      "available_for_purchase" in data.tags ? true : null,
                  guildConnections:
                      "guild_connections" in data.tags ? true : null,
              }
            : null;
    }
}
