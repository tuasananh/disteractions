import { ErrorCodes } from "./error_codes.js";

export const messages = {
    [ErrorCodes.CommandInteractionCannotDeferUpdate]:
        "Command interactions cannot use deferUpdate, maybe you meant to use deferReply",
    [ErrorCodes.CommandInteractionCannotUpdate]:
        "Command interactions cannot use update, maybe you meant to use reply",
    [ErrorCodes.ModalSubmitInteractionCannotShowModal]:
        "Modal submit interactions cannot use showModal",
};
