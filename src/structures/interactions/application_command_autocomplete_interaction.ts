import {
    InteractionResponseType,
    type APIApplicationCommandAutocompleteInteraction,
    type APIInteractionResponse,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { DisteractionContext } from "../disteraction_context.js";
import { Interaction } from "./interaction.js";

export class ApplicationCommandAutocompleteInteraction<
    E extends Env
> extends Interaction<E> {
    data: APIApplicationCommandAutocompleteInteraction;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIApplicationCommandAutocompleteInteraction
    ) {
        super(ctx, data);
        this.data = data;
    }

    get commandName() {
        return this.data.data.name;
    }

    getFocusedOption() {
        return this.data.data.options.find(
            (option) => "focused" in option && option.focused
        );
    }

    async respond<ChoiceType extends string | number>(
        choices: {
            name: string;
            value: ChoiceType;
        }[]
    ): Promise<Response> {
        return this.ctx.hono.json<APIInteractionResponse>({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: choices,
            },
        });
    }
}
