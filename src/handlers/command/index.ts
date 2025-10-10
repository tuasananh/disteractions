import type { Env } from "hono";
import type { CommandInteraction } from "../../structures/interaction/index.js";
import { chatInputApplicationCommandHandler } from "./chat_input.js";

export async function applicationCommandHandler<E extends Env>(
    interaction: CommandInteraction<E>
) {
    if (interaction.isChatInputCommand()) {
        return await chatInputApplicationCommandHandler(interaction);
    }

    return interaction.badRequest();
}
