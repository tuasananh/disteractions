import type { Env } from "hono";
import type { ApplicationCommandInteraction } from "../../structures/interactions/application_command_interaction.js";
import { chatInputApplicationCommandHandler } from "./chat_input.js";

export async function applicationCommandHandler<E extends Env>(
    interaction: ApplicationCommandInteraction<E>
) {
    if (interaction.isChatInput()) {
        return await chatInputApplicationCommandHandler(interaction);
    }

    return interaction.badRequest();
}
