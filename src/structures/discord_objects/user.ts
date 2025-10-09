import type {
    APIUser,
    NameplatePalette,
    Snowflake,
    UserFlags,
    UserPremiumType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import type { DisteractionContext } from "../disteraction_context.js";

/**
 * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
 */
export type AvatarDecorationData = {
    /**
     * The avatar decoration hash
     *
     * @see {@link https://discord.com/developers/docs/reference#image-formatting}
     */
    asset: string;
    /**
     * The id of the avatar decoration's SKU
     */
    skuId: Snowflake;
};
/**
 * The collectibles the user has, excluding Avatar Decorations and Profile Effects.
 *
 * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
 */
export type Collectibles = {
    /**
     * Object mapping of {@link APINameplateData}
     */
    nameplate: NameplateData | null;
};
/**
 * @see {@link https://discord.com/developers/docs/resources/user#nameplate}
 */
export type NameplateData = {
    /**
     * ID of the nameplate SKU
     */
    skuId: Snowflake;
    /**
     * Path to the nameplate asset
     *
     * @example `nameplates/nameplates/twilight/`
     */
    asset: string;
    /**
     * The label of this nameplate. Currently unused
     */
    label: string;
    /**
     * Background color of the nameplate
     */
    palette: NameplatePalette;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-primary-guild}
 */
export type UserPrimaryGuild = {
    /**
     * The id of the user's primary guild
     */
    identityGuildId: Snowflake | null;
    /**
     * Whether the user is displaying the primary guild's server tag.
     * This can be `null` if the system clears the identity, e.g. because the server no longer supports tags
     */
    identityEnabled: boolean | null;
    /**
     * The text of the user's server tag. Limited to 4 characters
     */
    tag: string | null;
    /**
     * The server tag badge hash
     *
     * @see {@link https://discord.com/developers/docs/reference#image-formatting}
     */
    badge: string | null;
};

export class User<E extends Env> extends Base<E> {
    /**
     * The user's username, not unique across the platform
     */
    username: string;
    /**
     * The user's Discord-tag
     */
    discriminator: string;
    /**
     * The user's display name, if it is set. For bots, this is the application name
     */
    globalName: string | null;
    /**
     * The user's avatar hash
     *
     * @see {@link https://discord.com/developers/docs/reference#image-formatting}
     */
    avatar: string | null;
    /**
     * Whether the user belongs to an OAuth2 application
     */
    bot: boolean | null;
    /**
     * Whether the user is an Official Discord System user (part of the urgent message system)
     */
    system: boolean | null;
    /**
     * Whether the user has two factor enabled on their account
     */
    mfaEnabled: boolean | null;
    /**
     * The user's banner hash
     *
     * @see {@link https://discord.com/developers/docs/reference#image-formatting}
     */
    banner: string | null;
    /**
     * The user's banner color encoded as an integer representation of hexadecimal color code
     */
    accentColor: number | null;
    /**
     * The user's chosen language option
     */
    locale: string | null;
    /**
     * Whether the email on this account has been verified
     */
    verified: boolean | null;
    /**
     * The user's email
     */
    email: string | null;
    /**
     * The flags on a user's account
     *
     * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
     */
    flags: UserFlags | null;
    /**
     * The type of Nitro subscription on a user's account
     *
     * @see {@link https://discord.com/developers/docs/resources/user#user-object-premium-types}
     */
    premiumType: UserPremiumType | null;
    /**
     * The public flags on a user's account
     *
     * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
     */
    publicFlags: UserFlags | null;
    /**
     * The data for the user's avatar decoration
     *
     * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
     */
    avatarDecorationData: AvatarDecorationData | null;
    /**
     * The data for the user's collectibles
     *
     * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
     */
    collectibles: Collectibles | null;
    /**
     * The user's primary guild
     *
     * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-primary-guild}
     */
    primaryGuild?: UserPrimaryGuild | null;

    constructor(ctx: DisteractionContext<E>, data: APIUser) {
        super(ctx, data);

        this.username = data.username;
        this.discriminator = data.discriminator;
        this.globalName = data.global_name;
        this.avatar = data.avatar;
        this.bot = data.bot ?? null;
        this.system = data.system ?? null;
        this.mfaEnabled = data.mfa_enabled ?? null;
        this.banner = data.banner ?? null;
        this.accentColor = data.accent_color ?? null;
        this.locale = data.locale ?? null;
        this.verified = data.verified ?? null;
        this.email = data.email ?? null;
        this.flags = data.flags ?? null;
        this.premiumType = data.premium_type ?? null;
        this.publicFlags = data.public_flags ?? null;
        this.avatarDecorationData = data.avatar_decoration_data
            ? {
                  asset: data.avatar_decoration_data.asset,
                  skuId: data.avatar_decoration_data.sku_id,
              }
            : null;
        this.collectibles = data.collectibles
            ? {
                  nameplate: data.collectibles.nameplate
                      ? {
                            skuId: data.collectibles.nameplate.sku_id,
                            asset: data.collectibles.nameplate.asset,
                            label: data.collectibles.nameplate.label,
                            palette: data.collectibles.nameplate.palette,
                        }
                      : null,
              }
            : null;
        this.primaryGuild = data.primary_guild
            ? {
                  identityGuildId: data.primary_guild.identity_guild_id,
                  identityEnabled: data.primary_guild.identity_enabled,
                  tag: data.primary_guild.tag,
                  badge: data.primary_guild.badge,
              }
            : null;
    }
}
