import { ApplicationCommandOptionType } from "@discordjs/core/http-only";
import type { Env } from "hono";
import type {
    ChatInputApplicationCommandArguments,
    ChatInputApplicationCommandCallback,
    ChatInputApplicationCommandInteraction,
} from "../../structures/index.js";

export async function chatInputApplicationCommandHandler<E extends Env>(
    interaction: ChatInputApplicationCommandInteraction<E>
): Promise<Response> {
    const name = interaction.commandName;
    const command = interaction.ctx.commandMap.get(name);

    if (!command) {
        return interaction.badRequest();
    }

    const invoked_user = interaction.user;

    if (
        !invoked_user ||
        ((command.ownerOnly ?? false) &&
            invoked_user.id !== interaction.ctx.ownerId)
    ) {
        return interaction.jsonReply("Permissions denied.");
    }

    const inputMap: Record<string, string | number | boolean | undefined> = {};

    for (const opt of interaction.data.data.options ?? []) {
        switch (opt.type) {
            case ApplicationCommandOptionType.Subcommand:
            case ApplicationCommandOptionType.SubcommandGroup:
                // we will never do this
                break;
            case ApplicationCommandOptionType.Boolean:
                inputMap[opt.name] = Boolean(opt.value);
                break;
            case ApplicationCommandOptionType.Integer:
                inputMap[opt.name] = Number(opt.value);
                break;
            case ApplicationCommandOptionType.Number:
                inputMap[opt.name] = Number(opt.value);
                break;
            case ApplicationCommandOptionType.String:
                inputMap[opt.name] = String(opt.value);
                break;
            case ApplicationCommandOptionType.User:
                console.log("User", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Channel:
                console.log("Channel", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Role:
                console.log("Role", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Mentionable:
                console.log("Mentionable", opt.value);
                inputMap[opt.name] = opt.value;
                break;
            case ApplicationCommandOptionType.Attachment:
                console.log("Attachment", opt.value);
                inputMap[opt.name] = opt.value;
                break;
        }
    }

    if (!("shouldDefer" in command.runner) || !command.runner.shouldDefer) {
        const callback =
            "callback" in command.runner
                ? command.runner.callback
                : command.runner;
        return await callback(interaction, inputMap);
    }

    const promise = async (
        callback: ChatInputApplicationCommandCallback<
            E,
            ChatInputApplicationCommandArguments<E>,
            void
        >
    ) => {
        while (!interaction.ctx.hono.res.ok) {
            await new Promise<void>((f) => f());
        }

        await callback(interaction, inputMap);
    };

    interaction.ctx.hono.executionCtx.waitUntil(
        promise(command.runner.callback)
    );

    return interaction.jsonDefer();
}
