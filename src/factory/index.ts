import type { Env } from "hono";
import {
    Button,
    ChatInputApplicationCommand,
    Modal,
    type ButtonDefaultValues,
    type ButtonOptions,
    type ChatInputApplicationCommandArguments,
    type ChatInputApplicationCommandOptions,
    type ModalFields,
    type ModalOptions,
} from "../structures/index.js";

/**
 * Factory class for creating Discord interaction components (slash commands, buttons, modals).
 *
 * This is the main entry point for creating type-safe Discord interactions in the disteractions framework.
 * The factory provides methods to create slash commands, reactive buttons, and modals with full TypeScript support.
 *
 * The generic type E extends Hono's Env type for context binding in serverless environments.
 *
 * @example
 * ```typescript
 * import { DisteractionsFactory } from 'disteractions';
 *
 * const factory = new DisteractionsFactory();
 *
 * // Create a slash command
 * const pingCommand = factory.slashCommand({
 *   name: 'ping',
 *   description: 'Replies with Pong!',
 *   runner: async (interaction) => {
 *     return interaction.jsonReply('Pong!');
 *   }
 * });
 * ```
 */
export class DisteractionsFactory<E extends Env> {
    /**
     * Creates a new slash command (chat input application command).
     *
     * This method returns a factory function that creates {@link ChatInputApplicationCommand} instances
     * with type-safe arguments and options. The returned command can be registered with Discord
     * and handled by the interaction system.
     *
     * @returns A factory function that creates slash commands
     *
     * @example
     * ```typescript
     * const greetCommand = factory.slashCommand({
     *   name: 'greet',
     *   description: 'Greet a user',
     *   arguments: {
     *     user: {
     *       type: ApplicationCommandOptionType.User,
     *       description: 'User to greet',
     *       required: true
     *     }
     *   },
     *   runner: async (interaction, args) => {
     *     return interaction.jsonReply(`Hello ${args.user}!`);
     *   }
     * });
     * ```
     */
    get slashCommand() {
        return function <Args extends ChatInputApplicationCommandArguments<E>>(
            opts: ChatInputApplicationCommandOptions<E, Args>
        ) {
            return new ChatInputApplicationCommand<E, Args>(opts);
        };
    }

    /**
     * Creates a new reactive button component.
     *
     * Reactive buttons maintain state through default values and can dynamically update
     * their appearance and behavior. They're useful for creating interactive UI components
     * that need to persist data between interactions.
     *
     * @returns A factory function that creates reactive buttons
     *
     * @example
     * ```typescript
     * const counterButton = factory.reactiveButton({
     *   id: 1,
     *   defaultValues: {
     *     style: ButtonStyle.Primary
     *   },
     *   runner: async (interaction, data) => {
     *      return interaction.jsonReply(`Received: ${data}`);
     *   }
     * });
     * ```
     */
    get reactiveButton() {
        return function <D extends ButtonDefaultValues>(
            opts: ButtonOptions<E, D>
        ) {
            return new Button<E, D>(opts);
        };
    }

    /**
     * Creates a new modal dialog.
     *
     * Modals allow you to create forms with text inputs and other components
     * that users can fill out. The fields are type-safe and automatically
     * validated when submitted.
     *
     * @returns A factory function that creates modals
     *
     * @example
     * ```typescript
     * const feedbackModal = factory.modal({
     *   id: 1,
     *   title: 'Send Feedback',
     *   fields: {
     *     subject: {
     *       type: ComponentType.TextInput,
     *       style: TextInputStyle.Short,
     *       label: 'Subject',
     *       required: true
     *     },
     *     message: {
     *       type: ComponentType.TextInput,
     *       style: TextInputStyle.Paragraph,
     *       label: 'Message',
     *       required: false
     *     }
     *   },
     *   runner: async (interaction, fields) => {
     *     return interaction.jsonReply(`Thanks for: ${fields.subject}`);
     *   }
     * });
     * ```
     */
    get modal() {
        return function <Fields extends ModalFields>(
            opts: ModalOptions<E, Fields>
        ) {
            return new Modal<E, Fields>(opts);
        };
    }
}
