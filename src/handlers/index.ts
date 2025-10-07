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
    InteractionType,
    type APIChatInputApplicationCommandInteraction,
    type APIInteraction,
    type APIMessageComponentButtonInteraction,
} from "@discordjs/core/http-only";
import type { Context, Env } from "hono";
import nacl from "tweetnacl";
import {
    DisteractionContext,
    type DisteractionContextOptions,
} from "../structures/disteraction_context.js";
import {
    ChatInputApplicationCommandInteraction,
    Interaction,
    MessageComponentButtonInteraction,
    ModalSubmitInteraction,
} from "../structures/index.js";
import { ApplicationCommandAutocompleteInteraction } from "../structures/interactions/application_command_autocomplete_interaction.js";
import { applicationCommandHandler } from "./application_command/index.js";
import { applicationCommandAutocompleteHandler } from "./application_command_autocomplete/index.js";
import { messageComponentHandler } from "./message_component/index.js";
import { modalSubmitHandler } from "./modal_submit/index.js";
export * from "./application_command/index.js";
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
const makeInteraction = async <E extends Env>(
    opts: DisteractionContextOptions<E>
) => {
    const ctx = new DisteractionContext(opts);
    const data: APIInteraction = await opts.hono.req.json();

    switch (data.type) {
        case InteractionType.ApplicationCommand:
            switch (data.data.type) {
                case ApplicationCommandType.ChatInput:
                    return new ChatInputApplicationCommandInteraction(
                        ctx,
                        data as APIChatInputApplicationCommandInteraction
                    );
                default:
                    break;
            }
            break;
        case InteractionType.MessageComponent:
            switch (data.data.component_type) {
                case ComponentType.Button:
                    return new MessageComponentButtonInteraction(
                        ctx,
                        data as APIMessageComponentButtonInteraction
                    );
                default:
                    break;
            }

            break;
        case InteractionType.ModalSubmit:
            return new ModalSubmitInteraction(ctx, data);
        case InteractionType.ApplicationCommandAutocomplete:
            return new ApplicationCommandAutocompleteInteraction(ctx, data);
        default:
            break;
    }

    return new Interaction(ctx, data);
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

    const interaction = await makeInteraction(opts);

    if (interaction.type === InteractionType.Ping) {
        return interaction.jsonPong();
    }

    if (interaction.isApplicationCommand()) {
        return await applicationCommandHandler(interaction);
    }

    if (interaction.isModalSubmit()) {
        return await modalSubmitHandler(interaction);
    }

    if (interaction.isMessageComponent()) {
        return await messageComponentHandler(interaction);
    }

    if (interaction.isApplicationCommandAutocomplete()) {
        return await applicationCommandAutocompleteHandler(interaction);
    }

    return interaction.badRequest();
}
