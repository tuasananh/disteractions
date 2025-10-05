import { ComponentType } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type {
    ModalCallback,
    ModalFields,
    ModalSubmitInteraction,
} from "../../structures/index.js";

export async function modalSubmitHandler<E extends Env>(
    interaction: ModalSubmitInteraction<E>
): Promise<Response> {
    const modalId = interaction.custom_id.at(0)?.charCodeAt(0);
    if (modalId === undefined) return interaction.badRequest();

    const modal = interaction.ctx.modalMap.get(modalId);

    if (!modal) {
        return interaction.badRequest();
    }

    const args: Record<string, string | string[]> = {};

    interaction.data.data.components.forEach((value) => {
        switch (value.type) {
            case ComponentType.ActionRow:
                break;
            case ComponentType.TextDisplay:
                break;
            case ComponentType.Label: {
                const name = value.component.custom_id;
                switch (value.component.type) {
                    case ComponentType.TextInput:
                        args[name] = value.component.value;
                        break;
                    case ComponentType.StringSelect:
                        args[name] = value.component.values;
                        break;
                    default:
                        // not yet implemented
                        break;
                }
                break;
            }
        }
    });

    if (!("shouldDefer" in modal.runner) || !modal.runner.shouldDefer) {
        const callback =
            "callback" in modal.runner ? modal.runner.callback : modal.runner;
        return await callback(interaction, args);
    }

    const promise = async (callback: ModalCallback<E, ModalFields, void>) => {
        while (!interaction.ctx.hono.res.ok) {
            await new Promise<void>((f) => f());
        }

        await callback(interaction, args);
    };

    interaction.ctx.hono.executionCtx.waitUntil(promise(modal.runner.callback));

    return interaction.jsonDefer();
}
