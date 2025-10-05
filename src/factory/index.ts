import type { Env } from "hono";
import {
    Button,
    ChatInputApplicationCommand,
    Modal,
    type ButtonDefaultValues,
    type ButtonOptions,
    type ChatInputApplicationCommandArguments,
    type ChatInputApplicationCommandOptions,
    type ModalFields,
    type ModalOptions,
} from "../structures/index.js";

export class DisteractionsFactory<E extends Env> {
    get slashCommand() {
        return function <Args extends ChatInputApplicationCommandArguments<E>>(
            opts: ChatInputApplicationCommandOptions<E, Args>
        ) {
            return new ChatInputApplicationCommand<E, Args>(opts);
        };
    }

    get reactiveButton() {
        return function <D extends ButtonDefaultValues>(
            opts: ButtonOptions<E, D>
        ) {
            return new Button<E, D>(opts);
        };
    }

    get modal() {
        return function <Fields extends ModalFields>(
            opts: ModalOptions<E, Fields>
        ) {
            return new Modal<E, Fields>(opts);
        };
    }
}
