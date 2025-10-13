import type { Env } from "hono";
import type { MessageComponentInteraction } from "../../structures/index.js";
import { messageComponentButtonHandler } from "./button.js";

export * from "./button.js";

export async function messageComponentHandler<E extends Env>(
    interaction: MessageComponentInteraction<E>
): Promise<Response> {
    if (interaction.isButton()) {
        return await messageComponentButtonHandler(interaction);
    }

    return interaction.badRequest();
}
