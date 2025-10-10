import {
    type APIAuthorizingIntegrationOwnersMap,
    type APIEntitlement,
    type APIInteraction,
    type APIInteractionGuildMember,
    ApplicationCommandType,
    ComponentType,
    InteractionContextType,
    InteractionType,
    Locale,
    type Permissions,
    type Snowflake,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";
import { BaseChannel } from "../discord_objects/base_channel.js";
import { Guild } from "../discord_objects/guild.js";
import { User } from "../discord_objects/user.js";
import type { DisteractionContext } from "../disteraction_context.js";
import type { AutocompleteInteraction } from "./autocomplete_interaction.js";
import type {
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    PrimaryEntryPointCommandInteraction,
    UserContextMenuCommandInteraction,
} from "./command_interaction/index.js";
import type {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    MessageComponentInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
} from "./message_component_interaction/index.js";
import type { ModalSubmitInteraction } from "./modal_submit_interaction.js";
export * from "./autocomplete_interaction.js";
export * from "./command_interaction/index.js";
export * from "./message_component_interaction/index.js";
export * from "./modal_submit_interaction.js";
export * from "./repliable_interaction.js";

/**
 * Represents an interaction
 */
export class BaseInteraction<E extends Env> extends Base<E> {
    declare rawData: APIInteraction;
    /**
     * The interaction's type
     */
    type: InteractionType;

    /**
     * The interaction's token
     */
    token: string;

    /**
     * The application's id
     */
    applicationId: Snowflake;

    /**
     * The id of the channel this interaction was sent in
     */
    channelId: Snowflake | null;

    /**
     * The id of the guild this interaction was sent in
     */
    guildId: Snowflake | null;

    /**
     * The user who created this interaction
     */
    user: User<E>;

    /**
     * If this interaction was sent in a guild, the member which sent it
     */
    member: APIInteractionGuildMember | null;
    /**
     * The version
     */
    version: number;

    /**
     * Set of permissions the application or bot has within the channel the interaction was sent from
     */
    appPermissions: Permissions;
    /**
     * The permissions of the member, if one exists, in the channel this interaction was executed in
     */
    memberPermissions: Permissions | null;
    /**
     * The locale of the user who invoked this interaction
     */
    locale: Locale | null;
    /**
     * The preferred locale from the guild this interaction was sent in
     */
    guildLocale: Locale | null;
    /**
     * The entitlements for the invoking user, representing access to premium SKUs
     */
    entitlements: APIEntitlement[];
    /**
     * Mapping of installation contexts that the interaction was authorized for the related user or guild ids
     *
     * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-authorizing-integration-owners-object}
     */
    authorizingIntegrationOwners: APIAuthorizingIntegrationOwnersMap;
    /**
     * Context where the interaction was triggered from
     */
    context: InteractionContextType | null;
    /**
     * attachment size limit in bytes
     */
    attachmentsizelimit: number;
    /**
     * Creates a new Interaction instance.
     *
     * @param ctx - The disteraction context
     * @param data - The raw Discord API interaction data
     */
    constructor(ctx: DisteractionContext<E>, data: APIInteraction) {
        super(ctx, data);
        this.type = data.type;

        this.token = data.token;

        this.applicationId = data.application_id;

        this.channelId = data.channel?.id ?? null;

        this.guildId = data.guild_id ?? null;

        this.user = new User(ctx, data.user ?? data.member!.user);

        this.member = data.member ?? null;

        this.version = data.version;

        this.appPermissions = data.app_permissions;

        this.memberPermissions = data.member?.permissions ?? null;

        this.locale = "locale" in data ? data.locale : null;

        this.guildLocale = data.guild_locale ?? null;

        this.entitlements = data.entitlements;

        this.authorizingIntegrationOwners = data.authorizing_integration_owners;

        this.context = data.context ?? null;

        this.attachmentsizelimit = data.attachment_size_limit;
    }

    /**
     * The channel this interaction was sent in
     */
    async getChannel() {
        if (this.channelId === null) return null;
        return new BaseChannel(
            this.ctx,
            await this.ctx.discord.channels.get(this.channelId)
        );
    }

    /**
     * The guild this interaction was sent in
     */
    async getGuild() {
        if (this.guildId === null) return null;
        return new Guild(
            this.ctx,
            await this.ctx.discord.guilds.get(this.guildId)
        );
    }

    /**
     * Indicates whether this interaction is received from a guild.
     */
    inGuild() {
        return Boolean(this.guildId !== null && this.member);
    }

    // /**
    //  * Indicates whether this interaction is received from a cached guild.
    //  */
    // inCachedGuild() {
    //     return Boolean(this.guild && this.member);
    // }

    // /**
    //  * Indicates whether or not this interaction is received from an uncached guild.
    //  *
    //  * @returns {boolean}
    //  */
    // inRawGuild() {
    //     return Boolean(this.guildId && !this.guild && this.member);
    // }

    /**
     * Indicates whether this interaction is an {@link AutocompleteInteraction}
     */
    isAutocomplete(): this is AutocompleteInteraction<E> {
        return this.type === InteractionType.ApplicationCommandAutocomplete;
    }

    /**
     * Indicates whether this interaction is a {@link CommandInteraction}
     */
    isCommand(): this is CommandInteraction<E> {
        return this.type === InteractionType.ApplicationCommand;
    }

    /**
     * Indicates whether this interaction is a {@link ChatInputCommandInteraction}.
     */
    isChatInputCommand(): this is ChatInputCommandInteraction<E> {
        return (
            this.isCommand() &&
            this.commandType === ApplicationCommandType.ChatInput
        );
    }

    /**
     * Indicates whether this interaction is a {@link ContextMenuCommandInteraction}
     */
    isContextMenuCommand(): this is ContextMenuCommandInteraction<E> {
        return (
            this.isCommand() &&
            [
                ApplicationCommandType.User,
                ApplicationCommandType.Message,
            ].includes(this.commandType)
        );
    }

    /**
     * Indicates whether this interaction is a {@link PrimaryEntryPointCommandInteraction}
     */
    isPrimaryEntryPointCommand(): this is PrimaryEntryPointCommandInteraction<E> {
        return (
            this.isCommand() &&
            this.commandType === ApplicationCommandType.PrimaryEntryPoint
        );
    }

    /**
     * Indicates whether this interaction is a {@link MessageComponentInteraction}
     */
    isMessageComponent(): this is MessageComponentInteraction<E> {
        return this.type === InteractionType.MessageComponent;
    }

    /**
     * Indicates whether this interaction is a {@link ModalSubmitInteraction}
     */
    isModalSubmit(): this is ModalSubmitInteraction<E> {
        return this.type === InteractionType.ModalSubmit;
    }

    /**
     * Indicates whether this interaction is a {@link UserContextMenuCommandInteraction}
     */
    isUserContextMenuCommand(): this is UserContextMenuCommandInteraction<E> {
        return (
            this.isContextMenuCommand() &&
            this.commandType === ApplicationCommandType.User
        );
    }

    /**
     * Indicates whether this interaction is a {@link MessageContextMenuCommandInteraction}
     */
    isMessageContextMenuCommand(): this is MessageContextMenuCommandInteraction<E> {
        return (
            this.isContextMenuCommand() &&
            this.commandType === ApplicationCommandType.Message
        );
    }

    /**
     * Indicates whether this interaction is a {@link ButtonInteraction}.
     */
    isButton(): this is ButtonInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.Button
        );
    }

    /**
     * Indicates whether this interaction is a select menu of any known type.
     */
    isSelectMenu() {
        return (
            this.isMessageComponent() &&
            [
                ComponentType.RoleSelect,
                ComponentType.StringSelect,
                ComponentType.UserSelect,
                ComponentType.ChannelSelect,
                ComponentType.MentionableSelect,
            ].includes(this.componentType)
        );
    }

    /**
     * Indicates whether this interaction is a {@link StringSelectMenuInteraction}.
     */
    isStringSelectMenu(): this is StringSelectMenuInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.StringSelect
        );
    }

    /**
     * Indicates whether this interaction is a {@link UserSelectMenuInteraction}
     */
    isUserSelectMenu(): this is UserSelectMenuInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.UserSelect
        );
    }

    /**
     * Indicates whether this interaction is a {@link RoleSelectMenuInteraction}
     */
    isRoleSelectMenu(): this is RoleSelectMenuInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.RoleSelect
        );
    }

    /**
     * Indicates whether this interaction is a {@link ChannelSelectMenuInteraction}
     */
    isChannelSelectMenu(): this is ChannelSelectMenuInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.ChannelSelect
        );
    }

    /**
     * Indicates whether this interaction is a {@link MentionableSelectMenuInteraction}
     */
    isMentionableSelectMenu(): this is MentionableSelectMenuInteraction<E> {
        return (
            this.isMessageComponent() &&
            this.componentType === ComponentType.MentionableSelect
        );
    }

    /**
     * Indicates whether this interaction can be replied to.
     */
    isRepliable() {
        return ![
            InteractionType.Ping,
            InteractionType.ApplicationCommandAutocomplete,
        ].includes(this.type);
    }

    /**
     * Responds with a 400 Bad Request error.
     *
     * Use this when the interaction data is malformed or invalid.
     *
     * @returns HTTP 400 response with error message
     */
    badRequest(error: string = "Bad Request"): Response {
        return this.ctx.hono.json({ error }, 400);
    }
}
