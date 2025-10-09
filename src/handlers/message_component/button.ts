import type { Env } from "hono";
import type {
    ButtonCallback,
    ButtonInteraction,
} from "../../structures/index.js";

export async function messageComponentButtonHandler<E extends Env>(
    interaction: ButtonInteraction<E>
): Promise<Response> {
    const buttonId = interaction.customId.at(0)?.charCodeAt(0);

    if (buttonId === undefined) return interaction.badRequest();

    const button = interaction.ctx.buttonMap.get(buttonId);

    const data = interaction.customId.slice(1);

    if (!button) {
        return interaction.badRequest();
    }

    if (!("shouldDefer" in button.runner) || !button.runner.shouldDefer) {
        const callback =
            "callback" in button.runner
                ? button.runner.callback
                : button.runner;
        return await callback(interaction, data);
    }

    const promise = async (callback: ButtonCallback<E, void>) => {
        while (!interaction.ctx.hono.res.ok) {
            await new Promise<void>((f) => f());
        }

        await callback(interaction, data);
    };

    interaction.ctx.hono.executionCtx.waitUntil(
        promise(button.runner.callback)
    );

    return interaction.jsonDeferReply();
}
