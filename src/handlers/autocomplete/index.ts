import type { Env } from "hono";
import type { AutocompleteInteraction } from "../../structures/index.js";

export async function applicationCommandAutocompleteHandler<E extends Env>(
    interaction: AutocompleteInteraction<E>
): Promise<Response> {
    const command = interaction.ctx.commandMap.get(interaction.commandName);
    if (!command) return interaction.badRequest();
    const focusedOption = interaction.options.find(
        (opt) => "focused" in opt && opt.focused
    );
    if (!focusedOption) return interaction.badRequest();
    if (!command.arguments) return interaction.badRequest();
    const argument = command.arguments[focusedOption.name];
    if (!argument) return interaction.badRequest();
    if (!("autocomplete" in argument)) return interaction.badRequest();
    if (!argument.autocomplete) return interaction.badRequest();
    if (argument.type !== focusedOption.type) return interaction.badRequest();
    const choices = await argument.autocompleteCallback(
        interaction,
        focusedOption.value
    );
    return interaction.jsonRespond(choices);
}
