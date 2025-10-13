/**
 * Main entry point for the disteractions Discord interactions framework.
 * 
 * This module re-exports all the core functionality from Discord.js core and the framework's
 * custom modules including factories, handlers, structures, types, and utilities.
 * 
 * @example
 * ```typescript
 * import { DisteractionsFactory, interactionHandler } from 'disteractions';
 * 
 * const factory = new DisteractionsFactory();
 * const command = factory.slashCommand({
 *   name: 'ping',
 *   description: 'Replies with Pong!',
 *   runner: async (interaction) => {
 *     return interaction.jsonReply('Pong!');
 *   }
 * });
 * ```
 */

/** Re-export all Discord.js core HTTP-only functionality */
export * from "@discordjs/core/http-only";
/** Re-export factory classes for creating interactions */
export * from "./factory/index.js";
/** Re-export interaction handlers */
export * from "./handlers/index.js";
/** Re-export interaction structures and classes */
export * from "./structures/index.js";
/** Re-export type definitions */
export * from "./types/index.js";
/** Re-export utility functions and types */
export * from "./errors/index.js";
export * from "./utils/index.js";

