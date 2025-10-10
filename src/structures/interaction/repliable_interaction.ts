import {
    InteractionResponseType,
    MessageFlags,
    type APIInteractionResponse,
    type APIInteractionResponseCallbackData,
    type APIInteractionResponseDeferredChannelMessageWithSource,
    type APIModalInteractionResponseCallbackData,
    type Snowflake,
} from "@discordjs/core/http-only";
import type { RawFile } from "@discordjs/rest";
import type { Env } from "hono";
import { Message } from "../discord_objects/message.js";
import { BaseInteraction } from "./index.js";

export type InteractionMessageOptions =
    | (APIInteractionResponseCallbackData & {
          files?: RawFile[];
      })
    | string;
export class RepliableInteraction<E extends Env> extends BaseInteraction<E> {
    jsonDeferReply(ephemeral: boolean = false): Response {
        return this.ctx.hono.json<APIInteractionResponseDeferredChannelMessageWithSource>(
            {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: {
                    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
                },
            }
        );
    }

    jsonReply(options: InteractionMessageOptions): Response {
        if (typeof options === "string") {
            return this.ctx.hono.json<APIInteractionResponse>({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: { content: options },
            });
        }
        if (!("files" in options) || options.files.length === 0) {
            return this.ctx.hono.json<APIInteractionResponse>({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: options,
            });
        }

        const form = new FormData();
        const payload: APIInteractionResponse = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: options,
        };

        form.append("payload_json", JSON.stringify(payload));

        options.files.forEach((file, index) => {
            // Convert data to a valid type for FormData

            const fileData =
                typeof file.data === "number" || typeof file.data === "boolean"
                    ? String(file.data)
                    : file.data;

            const fileBlob: Blob = new Blob([Buffer.from(fileData)]);

            // Use provided key or fallback to files[index]
            const key = file.key ?? `files[${index}]`;

            // Append the file to the form
            form.append(key, fileBlob, file.name);
        });

        return new Response(form);
    }

    jsonDeferUpdate(): Response {
        return this.ctx.hono.json<APIInteractionResponse>({
            type: InteractionResponseType.DeferredMessageUpdate,
        });
    }

    jsonUpdate(options: InteractionMessageOptions): Response {
        if (typeof options === "string") {
            return this.ctx.hono.json<APIInteractionResponse>({
                type: InteractionResponseType.UpdateMessage,
                data: { content: options },
            });
        }
        if (!("files" in options) || options.files.length === 0) {
            return this.ctx.hono.json<APIInteractionResponse>({
                type: InteractionResponseType.UpdateMessage,
                data: options,
            });
        }

        const form = new FormData();
        const payload: APIInteractionResponse = {
            type: InteractionResponseType.UpdateMessage,
            data: options,
        };

        form.append("payload_json", JSON.stringify(payload));

        options.files.forEach((file, index) => {
            // Convert data to a valid type for FormData

            const fileData =
                typeof file.data === "number" || typeof file.data === "boolean"
                    ? String(file.data)
                    : file.data;

            const fileBlob: Blob = new Blob([Buffer.from(fileData)]);

            // Use provided key or fallback to files[index]
            const key = file.key ?? `files[${index}]`;

            // Append the file to the form
            form.append(key, fileBlob, file.name);
        });

        return new Response(form);
    }

    jsonShowModal(modal: APIModalInteractionResponseCallbackData): Response {
        return this.ctx.hono.json<APIInteractionResponse>({
            type: InteractionResponseType.Modal,
            data: modal,
        });
    }

    jsonLaunchActivity(): Response {
        return this.ctx.hono.json<APIInteractionResponse>({
            type: InteractionResponseType.LaunchActivity,
        });
    }

    async followUp(options: InteractionMessageOptions) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.followUp(
                this.applicationId,
                this.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    async editReply(options: InteractionMessageOptions) {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.editReply(
                this.applicationId,
                this.token,
                typeof options === "string" ? { content: options } : options
            )
        );
    }

    async deleteReply(messageId?: Snowflake) {
        await this.ctx.discord.interactions.deleteReply(
            this.applicationId,
            this.token,
            messageId
        );
    }

    async fetchReply() {
        return new Message(
            this.ctx,
            await this.ctx.discord.interactions.getOriginalReply(
                this.applicationId,
                this.token
            )
        );
    }

    async showModal(modal: APIModalInteractionResponseCallbackData) {
        await this.ctx.discord.interactions.createModal(
            this.applicationId,
            this.token,
            modal
        );
    }

    async updateMessage(options: InteractionMessageOptions) {
        await this.ctx.discord.interactions.updateMessage(
            this.id,
            this.token,
            typeof options === "string" ? { content: options } : options
        );
    }
}
