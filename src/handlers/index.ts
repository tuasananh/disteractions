/**
 * Core interaction handlers for processing Discord interactions.
 *
 * This module provides the main entry point for handling Discord interactions
 * in serverless environments. It includes request verification, interaction parsing,
 * and routing to appropriate specialized handlers.
 */

import {
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    InteractionType,
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteraction,
    type APIChatInputApplicationCommandInteraction,
    type APIInteraction,
    type APIMessageApplicationCommandInteraction,
    type APIMessageComponentButtonInteraction,
    type APIMessageComponentInteraction,
    type APIModalSubmitInteraction,
    type APIPrimaryEntryPointCommandInteraction,
    type APIUserApplicationCommandInteraction,
} from "@discordjs/core/http-only";
import type { Context, Env } from "hono";
import nacl from "tweetnacl";
import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    DisteractionContext,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    PrimaryEntryPointCommandInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction,
    type APIChannelSelectMenuInteraction,
    type APIMentionableSelectMenuInteraction,
    type APIRoleSelectMenuInteraction,
    type APIStringSelectMenuInteraction,
    type APIUserSelectMenuInteraction,
    type DisteractionContextOptions,
} from "../structures/index.js";
import { applicationCommandAutocompleteHandler } from "./autocomplete/index.js";
import { applicationCommandHandler } from "./command/index.js";
import { messageComponentHandler } from "./message_component/index.js";
import { modalSubmitHandler } from "./modal_submit/index.js";
export * from "./autocomplete/index.js";
export * from "./command/index.js";
export * from "./message_component/index.js";
export * from "./modal_submit/index.js";

/**
 * Verifies that an incoming request is actually from Discord.
 *
 * Uses Ed25519 cryptographic verification with Discord's public key to ensure
 * the request signature is valid. This prevents unauthorized access and ensures
 * only legitimate Discord interactions are processed.
 *
 * @param c - The Hono context containing the request
 * @param discordPublicKey - Discord application's public key for verification
 * @returns Promise resolving to true if the request is verified, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = await verifyDiscordRequest(context, process.env.DISCORD_PUBLIC_KEY!);
 * if (!isValid) {
 *   return context.text('Unauthorized', 401);
 * }
 * ```
 */
const verifyDiscordRequest = async <E extends Env>(
    c: Context<E>,
    discordPublicKey: string
) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.text(); // rawBody is expected to be a string, not raw bytes
    const isVerified =
        timestamp !== undefined &&
        signature !== undefined &&
        nacl.sign.detached.verify(
            Buffer.from(timestamp + body),
            Buffer.from(signature, "hex"),
            Buffer.from(discordPublicKey, "hex")
        );
    return isVerified;
};

/**
 * Creates the appropriate interaction instance based on the interaction type.
 *
 * Parses the raw Discord interaction data and creates a strongly-typed interaction
 * object. This function handles the type discrimination and ensures the correct
 * interaction class is instantiated for each interaction type.
 *
 * @param opts - Configuration options for creating the interaction context
 * @returns Promise resolving to the appropriate interaction instance
 *
 * @example
 * ```typescript
 * const interaction = await makeInteraction({
 *   hono: context,
 *   discordToken: env.DISCORD_TOKEN,
 *   discordPublicKey: env.DISCORD_PUBLIC_KEY,
 *   commands: [pingCommand]
 * });
 *
 * if (interaction.isApplicationCommand()) {
 *   // Handle slash commands
 * }
 * ```
 */
const makeInteraction = <E extends Env>(
    opts: DisteractionContextOptions<E>,
    data:
        | APIApplicationCommandAutocompleteInteraction
        | APIApplicationCommandInteraction
        | APIMessageComponentInteraction
        | APIModalSubmitInteraction
) => {
    const ctx = new DisteractionContext(opts);
    switch (data.type) {
        case InteractionType.ApplicationCommand:
            switch (data.data.type) {
                case ApplicationCommandType.ChatInput:
                    return new ChatInputCommandInteraction(
                        ctx,
                        data as APIChatInputApplicationCommandInteraction
                    );
                case ApplicationCommandType.User:
                    return new UserContextMenuCommandInteraction(
                        ctx,
                        data as APIUserApplicationCommandInteraction
                    );
                case ApplicationCommandType.Message:
                    return new MessageContextMenuCommandInteraction(
                        ctx,
                        data as APIMessageApplicationCommandInteraction
                    );
                case ApplicationCommandType.PrimaryEntryPoint:
                    return new PrimaryEntryPointCommandInteraction(
                        ctx,
                        data as APIPrimaryEntryPointCommandInteraction
                    );
            }
            break;
        case InteractionType.MessageComponent:
            switch (data.data.component_type) {
                case ComponentType.Button:
                    return new ButtonInteraction(
                        ctx,
                        data as APIMessageComponentButtonInteraction
                    );
                case ComponentType.StringSelect:
                    return new StringSelectMenuInteraction(
                        ctx,
                        data as APIStringSelectMenuInteraction
                    );
                case ComponentType.UserSelect:
                    return new UserSelectMenuInteraction(
                        ctx,
                        data as APIUserSelectMenuInteraction
                    );
                    break;
                case ComponentType.RoleSelect:
                    return new RoleSelectMenuInteraction(
                        ctx,
                        data as APIRoleSelectMenuInteraction
                    );
                case ComponentType.MentionableSelect:
                    return new MentionableSelectMenuInteraction(
                        ctx,
                        data as APIMentionableSelectMenuInteraction
                    );
                case ComponentType.ChannelSelect:
                    return new ChannelSelectMenuInteraction(
                        ctx,
                        data as APIChannelSelectMenuInteraction
                    );
            }
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            return new AutocompleteInteraction(ctx, data);
        case InteractionType.ModalSubmit:
            return new ModalSubmitInteraction(ctx, data);
    }
};

/**
 * Main interaction handler function for processing Discord interactions.
 *
 * This is the primary entry point for handling Discord interactions in your application.
 * It performs request verification, creates the appropriate interaction instance,
 * and routes to specialized handlers based on the interaction type.
 *
 * The function handles all supported interaction types:
 * - Ping (for URL verification)
 * - Slash commands (application commands)
 * - Button clicks (message components)
 * - Modal submissions
 * - Autocomplete requests
 *
 * @param opts - Configuration options including Hono context, Discord credentials, and interaction definitions
 * @returns Promise resolving to an HTTP response for the interaction
 *
 * @example
 * ```typescript
 * import { DisteractionsFactory, interactionHandler } from 'disteractions';
 * import { Hono } from 'hono';
 *
 * const app = new Hono();
 * const factory = new DisteractionsFactory();
 *
 * const pingCommand = factory.slashCommand({
 *   name: 'ping',
 *   description: 'Replies with Pong!',
 *   runner: async (interaction) => {
 *     return interaction.jsonReply('Pong!');
 *   }
 * });
 *
 * app.post('/interactions', async (c) => {
 *   return await interactionHandler({
 *     hono: c,
 *     discordToken: c.env.DISCORD_TOKEN,
 *     discordPublicKey: c.env.DISCORD_PUBLIC_KEY,
 *     commands: [pingCommand]
 *   });
 * });
 * ```
 */
export async function interactionHandler<E extends Env>(
    opts: DisteractionContextOptions<E>
) {
    const isValidRequest = await verifyDiscordRequest(
        opts.hono,
        opts.discordPublicKey
    );
    if (!isValidRequest) {
        return opts.hono.text("Bad request signature", 401);
    }

    const data = await opts.hono.req.json<APIInteraction>();

    if (data.type === InteractionType.Ping) {
        return opts.hono.json({ type: InteractionResponseType.Pong });
    }

    const interaction = makeInteraction(opts, data);

    if (interaction.isCommand()) {
        return await applicationCommandHandler(interaction);
    }

    if (interaction.isModalSubmit()) {
        return await modalSubmitHandler(interaction);
    }

    if (interaction.isMessageComponent()) {
        return await messageComponentHandler(interaction);
    }

    if (interaction.isAutocomplete()) {
        return await applicationCommandAutocompleteHandler(interaction);
    }
}
