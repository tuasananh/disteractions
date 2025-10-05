import type { API } from "@discordjs/core/http-only";
import type { Context, Env } from "hono";
import { makeApiFromToken } from "../utils/index.js";
import type { ChatInputApplicationCommand } from "./runners/chat_input_application_command/index.js";
import type { Button } from "./runners/index.js";
import type { Modal } from "./runners/modal/index.js";

export type DisteractionContextOptions<E extends Env> = {
    hono: Context<E>;
    discordToken: string;
    discordPublicKey: string;
    ownerId?: string;
    commands?: ChatInputApplicationCommand<E>[];
    buttons?: Button<E>[];
    modals?: Modal<E>[];
};

export class DisteractionContext<E extends Env> {
    hono: Context<E>;
    discord: API;
    ownerId?: string;
    commands: ChatInputApplicationCommand<E>[];
    buttons: Button<E>[];
    modals: Modal<E>[];
    commandMap: Map<string, ChatInputApplicationCommand<E>>;
    buttonMap: Map<number, Button<E>>;
    modalMap: Map<number, Modal<E>>;

    constructor(opts: DisteractionContextOptions<E>) {
        this.hono = opts.hono;
        this.discord = makeApiFromToken(opts.discordToken);
        if (opts.ownerId !== undefined) this.ownerId = opts.ownerId;
        this.commands = opts.commands ?? [];
        this.commandMap = new Map(
            this.commands.map((command) => [command.name, command])
        );
        this.buttons = opts.buttons ?? [];
        this.buttonMap = new Map(
            this.buttons.map((button) => [button.id, button])
        );
        this.modals = opts.modals ?? [];
        this.modalMap = new Map(this.modals.map((modal) => [modal.id, modal]));
    }

    get env() {
        return this.hono.env;
    }

    get get(): Context<E>["get"] {
        return this.hono.get;
    }

    get set(): Context<E>["set"] {
        return this.hono.set;
    }
}
