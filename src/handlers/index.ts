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

const verifyDiscordRequest = async <E extends Env>(
    c: Context<E>,
    discordPublicKey: string
) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.text(); // rawBody is expected to be a string, not raw bytes
    const isVerified =
        timestamp &&
        signature &&
        nacl.sign.detached.verify(
            Buffer.from(timestamp + body),
            Buffer.from(signature, "hex"),
            Buffer.from(discordPublicKey, "hex")
        );
    return isVerified;
};

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
