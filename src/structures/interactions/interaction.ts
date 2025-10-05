import {
    type APIInteraction,
    type APIInteractionResponseCallbackData,
    type APIInteractionResponseChannelMessageWithSource,
    type APIInteractionResponseDeferredChannelMessageWithSource,
    type APIInteractionResponsePong,
    type APIModalInteractionResponse,
    type APIModalInteractionResponseCallbackData,
    InteractionResponseType,
    InteractionType,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Message } from "../discord_objects/message.js";
import { User } from "../discord_objects/user.js";
import type { DisteractionContext } from "../disteraction_context.js";
import type { ApplicationCommandAutocompleteInteraction } from "./application_command_autocomplete_interaction.js";
import type { ApplicationCommandInteraction } from "./application_command_interaction.js";
import type { MessageComponentInteraction } from "./message_component_interaction.js";
import type { ModalSubmitInteraction } from "./modal_submit_interaction.js";

export class Interaction<E extends Env> {
    ctx: DisteractionContext<E>;
    data: APIInteraction;

    constructor(ctx: DisteractionContext<E>, data: APIInteraction) {
        this.ctx = ctx;
        this.data = data;
    }

    get type() {
        return this.data.type;
    }

    get user() {
        const api_user = this.data.member?.user ?? this.data.user;
        return api_user ? new User(this.ctx, api_user) : null;
    }

    isApplicationCommand(): this is ApplicationCommandInteraction<E> {
        return this.data.type === InteractionType.ApplicationCommand;
    }

    isModalSubmit(): this is ModalSubmitInteraction<E> {
        return this.data.type === InteractionType.ModalSubmit;
    }

    isMessageComponent(): this is MessageComponentInteraction<E> {
        return this.data.type === InteractionType.MessageComponent;
    }

    isApplicationCommandAutocomplete(): this is ApplicationCommandAutocompleteInteraction<E> {
        return (
            this.data.type === InteractionType.ApplicationCommandAutocomplete
        );
    }

    badRequest(): ReturnType<
        typeof this.ctx.hono.json<{ error: string }, 400>
    > {
        return this.ctx.hono.json({ error: "Bad Request" }, 400);
    }

    jsonPong(): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponsePong>
    > {
        return this.ctx.hono.json<APIInteractionResponsePong>({
            type: InteractionResponseType.Pong,
        });
    }

    jsonDefer(
        options: Pick<APIInteractionResponseCallbackData, "flags"> = {}
    ): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponseDeferredChannelMessageWithSource>
    > {
        return this.ctx.hono.json<APIInteractionResponseDeferredChannelMessageWithSource>(
            {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: options,
            }
        );
    }

    jsonShowModal(
        options: APIModalInteractionResponseCallbackData
    ): ReturnType<typeof this.ctx.hono.json<APIModalInteractionResponse>> {
        return this.ctx.hono.json<APIModalInteractionResponse>({
            type: InteractionResponseType.Modal,
            data: options,
        });
    }

    jsonReply(
        options: APIInteractionResponseCallbackData | string
    ): ReturnType<
        typeof this.ctx.hono.json<APIInteractionResponseChannelMessageWithSource>
    > {
        if (typeof options === "string") {
            options = { content: options };
        }
        return this.ctx.hono.json<APIInteractionResponseChannelMessageWithSource>(
            {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: options,
            }
        );
    }

    async followUp(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.followUp(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    async editReply(options: APIInteractionResponseCallbackData | string) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.editReply(
                this.data.application_id,
                this.data.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    async showModal(options: APIModalInteractionResponseCallbackData) {
        await this.ctx.discord.interactions.createModal(
            this.data.application_id,
            this.data.token,
            options
        );
    }
}
