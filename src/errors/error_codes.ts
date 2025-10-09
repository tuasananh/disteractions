/**
 * Error codes used throughout the disteractions framework.
 *
 * These error codes are based on Discord.js error codes and provide
 * consistent error identification across the framework. Each code
 * represents a specific error condition that can occur during
 * Discord interaction handling.
 *
 * @example
 * ```typescript
 * import { ErrorCodes } from './ErrorCodes';
 *
 * if (error.code === ErrorCodes.TokenInvalid) {
 *   console.log('Invalid Discord token provided');
 * }
 * ```
 */
export enum ErrorCodes {
    CommandInteractionCannotDeferUpdate,
    CommandInteractionCannotUpdate,
    ModalSubmitInteractionCannotShowModal,
}
