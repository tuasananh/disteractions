import type {
    APIModalInteractionResponseCallbackData,
    APIModalSubmitInteraction,
    InteractionType,
} from "@discordjs/core/http-only";
import { type Env } from "hono";
import { DisteractionsError } from "../../errors/disteraction_error.js";
import { ErrorCodes } from "../../errors/error_codes.js";
import { DisteractionContext } from "../disteraction_context.js";
import { RepliableInteraction } from "./repliable_interaction.js";

export class ModalSubmitInteraction<
    E extends Env
> extends RepliableInteraction<E> {
    declare rawData: APIModalSubmitInteraction;
    declare type: InteractionType.ModalSubmit;

    customId: string;
    components: APIModalSubmitInteraction["data"]["components"];

    constructor(
        context: DisteractionContext<E>,
        data: APIModalSubmitInteraction
    ) {
        super(context, data);
        this.customId = data.data.custom_id;
        this.components = data.data.components;
    }

    /**
     * @deprecated Modal submit interactions cannot use showModal.
     */
    override jsonShowModal(
        _modal: APIModalInteractionResponseCallbackData
    ): Response {
        throw new DisteractionsError(
            ErrorCodes.ModalSubmitInteractionCannotShowModal
        );
    }
}
