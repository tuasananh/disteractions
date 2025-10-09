import type { API } from "@discordjs/core/http-only";
import type { Context, Env } from "hono";
import { makeApiFromToken } from "../utils/index.js";
import type { ChatInputCommand } from "./runners/chat_input_command/index.js";
import type { Button } from "./runners/index.js";
import type { Modal } from "./runners/modal/index.js";

/**
 * Configuration options for creating a {@link DisteractionContext} instance.
 *
 * This type defines all the required and optional parameters needed to set up
 * the interaction context for handling Discord interactions in a serverless environment.
 */
export type DisteractionContextOptions<E extends Env> = {
    /**
     * The Hono context instance for the current HTTP request.
     *
     * This provides access to the request, response, and environment variables
     * in serverless platforms like Cloudflare Workers.
     */
    hono: Context<E>;
    /**
     * The bot token for the Discord application.
     *
     * This token is used to authenticate API requests to Discord.
     * Should be kept secure and typically stored as an environment variable.
     */
    discordToken: string;
    /**
     * The public key for the Discord application.
     *
     * Used to verify that incoming interaction requests are actually from Discord.
     * This key is provided in your Discord application settings.
     */
    discordPublicKey: string;
    /**
     * The Discord user ID of the bot owner.
     *
     * This is required for commands with `ownerOnly` set to true to work properly.
     * Only the user with this ID will be able to execute owner-only commands.
     */
    ownerId?: string;
    /**
     * The list of slash commands to be handled by this context.
     *
     * These commands will be automatically registered and made available
     * for execution when matching interactions are received.
     */
    commands?: ChatInputCommand<E>[];
    /**
     * The list of reactive buttons to be handled by this context.
     *
     * These buttons can maintain state and respond to user interactions
     * with dynamic behavior and data persistence.
     */
    buttons?: Button<E>[];
    /**
     * The list of modals to be handled by this context.
     *
     * These modals provide form-like interfaces for collecting user input
     * with validation and type safety.
     */
    modals?: Modal<E>[];
};

/**
 * Enhanced context class for handling Discord interactions in serverless environments.
 *
 * This class wraps the Hono context and provides additional functionality specific
 * to Discord bot interactions. It manages the Discord API client, interaction handlers,
 * and provides convenient access to environment variables and request data.
 *
 * The context automatically creates lookup maps for efficient interaction routing
 * and provides type-safe access to all registered commands, buttons, and modals.
 *
 * @example
 * ```typescript
 * const context = new DisteractionContext({
 *   hono: c, // Hono context from request handler
 *   discordToken: c.env.DISCORD_TOKEN,
 *   discordPublicKey: c.env.DISCORD_PUBLIC_KEY,
 *   commands: [pingCommand],
 *   buttons: [counterButton],
 *   modals: [feedbackModal]
 * });
 * ```
 */
export class DisteractionContext<E extends Env>
    implements
        Omit<
            DisteractionContextOptions<E>,
            "discordToken" | "discordPublicKey"
        >
{
    /** The original Hono context instance */
    hono: Context<E>;
    /** Discord API client instance for making API calls */
    discord: API;
    /** Discord user ID of the bot owner (for owner-only commands) */
    ownerId?: string;
    /** Array of registered slash commands */
    commands: ChatInputCommand<E>[];
    /** Array of registered reactive buttons */
    buttons: Button<E>[];
    /** Array of registered modals */
    modals: Modal<E>[];
    /**
     * A map of command names to their corresponding {@link ChatInputCommand} instances.
     *
     * This provides O(1) lookup time for command resolution during interaction handling.
     */
    commandMap: Map<string, ChatInputCommand<E>>;
    /**
     * A map of button IDs to their corresponding {@link Button} instances.
     *
     * This provides O(1) lookup time for button resolution during interaction handling.
     */
    buttonMap: Map<number, Button<E>>;
    /**
     * A map of modal IDs to their corresponding {@link Modal} instances.
     *
     * This provides O(1) lookup time for modal resolution during interaction handling.
     */
    modalMap: Map<number, Modal<E>>;

    /**
     * Creates a new DisteractionContext instance.
     *
     * Initializes the Discord API client, sets up lookup maps for efficient
     * interaction routing, and configures all provided interaction handlers.
     *
     * @param opts - Configuration options for the context
     */
    constructor(opts: DisteractionContextOptions<E>) {
        this.hono = opts.hono;
        this.discord = makeApiFromToken(opts.discordToken);
        if (opts.ownerId !== undefined) this.ownerId = opts.ownerId;
        this.commands = opts.commands ?? [];
        this.commandMap = new Map(
            this.commands.map((command) => [command.name, command])
        );
        this.buttons = opts.buttons ?? [];
        this.buttonMap = new Map(
            this.buttons.map((button) => [button.id, button])
        );
        this.modals = opts.modals ?? [];
        this.modalMap = new Map(this.modals.map((modal) => [modal.id, modal]));
    }

    /**
     * Access to environment bindings in serverless platforms.
     *
     * In Cloudflare Workers, this provides access to environment variables, secrets,
     * KV namespaces, D1 databases, R2 buckets, and other bound resources.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     */
    get env() {
        return this.hono.env;
    }

    /**
     * Retrieve values from the Hono context store.
     *
     * This method allows you to access values that were previously set using
     * the {@link set} method or by middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     */
    get get(): Context<E>["get"] {
        return this.hono.get;
    }

    /**
     * Store values in the Hono context for later retrieval.
     *
     * This method allows you to store values that can be accessed later
     * using the {@link get} method. Useful for sharing data between middleware
     * and interaction handlers.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     */
    get set(): Context<E>["set"] {
        return this.hono.set;
    }
}
