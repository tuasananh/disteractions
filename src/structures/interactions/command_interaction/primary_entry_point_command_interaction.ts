import type {
    APIPrimaryEntryPointCommandInteraction,
    ApplicationCommandType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type { DisteractionContext } from "../../disteraction_context.js";
import { CommandInteraction } from "./command_interaction.js";

export class PrimaryEntryPointCommandInteraction<
    E extends Env
> extends CommandInteraction<E> {
    declare rawData: APIPrimaryEntryPointCommandInteraction;
    declare commandType: ApplicationCommandType.PrimaryEntryPoint;

    constructor(
        ctx: DisteractionContext<E>,
        data: APIPrimaryEntryPointCommandInteraction
    ) {
        super(ctx, data);
    }
}
