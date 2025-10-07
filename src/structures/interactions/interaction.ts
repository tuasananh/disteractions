import {
    type APIInteraction,
    type APIInteractionResponseCallbackData,
    type APIInteractionResponseChannelMessageWithSource,
    type APIInteractionResponseDeferredChannelMessageWithSource,
    type APIInteractionResponsePong,
    type APIModalInteractionResponse,
    type APIModalInteractionResponseCallbackData,
    InteractionResponseType,
    InteractionType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Message } from "../discord_objects/message.js";
import { User } from "../discord_objects/user.js";
import type { DisteractionContext } from "../disteraction_context.js";
import type { ApplicationCommandAutocompleteInteraction } from "./application_command_autocomplete_interaction.js";
import type { ApplicationCommandInteraction } from "./application_command_interaction.js";
import type { MessageComponentInteraction } from "./message_component_interaction.js";
import type { ModalSubmitInteraction } from "./modal_submit_interaction.js";

/**
 * Base class for all Discord interactions.
 * 
 * This class provides common functionality for all interaction types including
 * type guards, response methods, and access to the interaction context and data.
 * It serves as the foundation for more specific interaction classes.
 * 
 * @example
 * ```typescript
 * // Type guards for interaction handling
 * if (interaction.isApplicationCommand()) {
 *   // Handle application command
 * } else if (interaction.isMessageComponent()) {
 *   // Handle button/select menu
 * }
 * ```
 */
export class Interaction<E extends Env> {
    /** The disteraction context containing API clients and configuration */
    ctx: DisteractionContext<E>;
    /** The raw Discord interaction data */
    data: APIInteraction;

    /**
     * Creates a new Interaction instance.
     * 
     * @param ctx - The disteraction context
     * @param data - The raw Discord interaction data
     */
    constructor(ctx: DisteractionContext<E>, data: APIInteraction) {
        this.ctx = ctx;
        this.data = data;
    }

    /**
     * The type of this interaction.
     * 
     * @returns The {@link InteractionType} enum value
     */
    get type() {
        return this.data.type;
    }

    /**
     * The user who triggered this interaction.
     * 
     * In guild contexts, this will be the user from the member object.
     * In DM contexts, this will be the user directly.
     * 
     * @returns A {@link User} instance or null if no user data is available
     */
    get user() {
        const api_user = this.data.member?.user ?? this.data.user;
        return api_user ? new User(this.ctx, api_user) : null;
    }

    /**
     * Type guard to check if this is an application command interaction.
     * 
     * @returns True if this is an {@link ApplicationCommandInteraction}
     */
    isApplicationCommand(): this is ApplicationCommandInteraction<E> {
        return this.data.type === InteractionType.ApplicationCommand;
    }

    /**
     * Type guard to check if this is a modal submit interaction.
     * 
     * @returns True if this is a {@link ModalSubmitInteraction}
     */
    isModalSubmit(): this is ModalSubmitInteraction<E> {
        return this.data.type === InteractionType.ModalSubmit;
    }

    /**
     * Type guard to check if this is a message component interaction.
     * 
     * @returns True if this is a {@link MessageComponentInteraction}
     */
    isMessageComponent(): this is MessageComponentInteraction<E> {
        return this.data.type === InteractionType.MessageComponent;
    }

    /**
     * Type guard to check if this is an application command autocomplete interaction.
     * 
     * @returns True if this is an {@link ApplicationCommandAutocompleteInteraction}
     */
    isApplicationCommandAutocomplete(): this is ApplicationCommandAutocompleteInteraction<E> {
        return (
            this.data.type === InteractionType.ApplicationCommandAutocomplete
        );
    }

    /**
     * Responds with a 400 Bad Request error.
     * 
     * Use this when the interaction data is malformed or invalid.
     * 
     * @returns HTTP 400 response with error message
     */
    badRequest(): ReturnType<
        typeof this.ctx.hono.json<{ error: string }, 400>
    > {
        return this.ctx.hono.json({ error: "Bad Request" }, 400);
    }

    /**
     * Responds with a pong response.
     * 
     * This is typically used for ping interactions during URL verification.
     * 
     * @returns JSON pong response
     */
    jsonPong(): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponsePong>
    > {
        return this.ctx.hono.json<APIInteractionResponsePong>({
            type: InteractionResponseType.Pong,
        });
    }

    /**
     * Defers the interaction response.
     * 
     * Use this when you need more time to process the interaction.
     * You have 15 minutes to follow up with {@link followUp} or {@link editReply}.
     * 
     * @param options - Optional flags for the deferred response
     * @returns JSON deferred response
     */
    jsonDefer(
        options: Pick<APIInteractionResponseCallbackData, "flags"> = {}
    ): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponseDeferredChannelMessageWithSource>
    > {
        return this.ctx.hono.json<APIInteractionResponseDeferredChannelMessageWithSource>(
            {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: options,
            }
        );
    }

    /**
     * Shows a modal dialog to the user.
     * 
     * The modal will be displayed immediately and the user can fill out the form.
     * 
     * @param options - Modal configuration including title and components
     * @returns JSON modal response
     */
    jsonShowModal(
        options: APIModalInteractionResponseCallbackData
    ): ReturnType<typeof this.ctx.hono.json<APIModalInteractionResponse>> {
        return this.ctx.hono.json<APIModalInteractionResponse>({
            type: InteractionResponseType.Modal,
            data: options,
        });
    }

    /**
     * Replies to the interaction with a message.
     * 
     * This is the primary way to respond to interactions with content.
     * Can accept either a string for simple text responses or a full message object.
     * 
     * @param options - Message content or full message data
     * @returns JSON message response
     * 
     * @example
     * ```typescript
     * // Simple text reply
     * return interaction.jsonReply('Hello World!');
     * 
     * // Rich message reply
     * return interaction.jsonReply({
     *   content: 'Hello!',
     *   embeds: [embed],
     *   components: [actionRow]
     * });
     * ```
     */
    jsonReply(
        options: APIInteractionResponseCallbackData | string
    ): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponseChannelMessageWithSource>
    > {
        if (typeof options === "string") {
            options = { content: options };
        }
        return this.ctx.hono.json<APIInteractionResponseChannelMessageWithSource>(
            {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: options,
            }
        );
    }

    /**
     * Sends a follow-up message to the interaction.
     * 
     * Can be used after the initial response to send additional messages.
     * These messages are separate from the original response and can be deleted independently.
     * 
     * @param options - Message content or full message data
     * @returns Promise resolving to the created {@link Message}
     */
    async followUp(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.followUp(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    /**
     * Edits the original interaction response.
     * 
     * Use this to modify the content of the initial reply after it has been sent.
     * Only works with interactions that have already been responded to.
     * 
     * @param options - New message content or full message data
     * @returns Promise resolving to the edited {@link Message}
     */
    async editReply(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.editReply(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    /**
     * Shows a modal dialog to the user (async version).
     * 
     * Alternative to {@link jsonShowModal} that uses the Discord API directly.
     * Use {@link jsonShowModal} for immediate responses.
     * 
     * @param options - Modal configuration including title and components
     */
    async showModal(options: APIModalInteractionResponseCallbackData) {
        await this.ctx.discord.interactions.createModal(
            this.data.application_id,
            this.data.token,
            options
        );
    }

    /**
     * Retrieves the original interaction response message.
     * 
     * @returns Promise resolving to the original {@link Message} response
     */
    async getOriginalReply() {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.getOriginalReply(
                this.data.application_id,
                this.data.token
            )
        );
    }

    /**
     * Deletes the initial reply to an interaction
     *
     * @param messageId - The id of the message to delete. If omitted, the original reply will be deleted
     */
    async deleteReply(messageId?: string) {
        await this.ctx.discord.interactions.deleteReply(
            this.data.application_id,
            this.data.token,
            messageId
        );
    }
}
