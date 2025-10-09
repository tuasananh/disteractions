import { ButtonBuilder } from "@discordjs/builders";
import {
    ButtonStyle,
    ComponentType,
    type APIButtonComponentWithCustomId,
    type APIMessageComponentEmoji,
} from "@discordjs/core/http-only";
import type { Env } from "hono";
import type {
    MakeOptionalIfUndefined,
    OptionalKeys,
} from "../../../utils/index.js";
import type { ButtonRunner } from "./runner.js";
export * from "./runner.js";

export type ButtonDefaultValues = OptionalKeys<
    Omit<APIButtonComponentWithCustomId, "custom_id" | "id" | "type">
>;

export type ButtonStyleNoLinkAndPremium =
    | ButtonStyle.Danger
    | ButtonStyle.Primary
    | ButtonStyle.Secondary
    | ButtonStyle.Success;

export type ButtonOptions<E extends Env, D extends ButtonDefaultValues> = {
    /**
     * A unique identifier for the button in range [0, 65535].
     * This will determine what button was clicked.
     */
    id: number;
    runner: ButtonRunner<E>;
    defaultValues?: D;
};

export type EitherLabelOrEmoji =
    | {
          label: string;
          emoji?: APIMessageComponentEmoji;
      }
    | {
          label?: string;
          emoji: APIMessageComponentEmoji;
      };

export type ButtonToAPIOptions<D extends ButtonDefaultValues> =
    MakeOptionalIfUndefined<{
        style: D["style"] extends undefined
            ? ButtonStyleNoLinkAndPremium
            : ButtonStyleNoLinkAndPremium | undefined;
        disabled?: boolean;
        data?: string;
    }> &
        (D extends EitherLabelOrEmoji
            ? {
                  label?: string;
                  emoji?: APIMessageComponentEmoji;
              }
            : EitherLabelOrEmoji);

export class Button<
    E extends Env,
    D extends ButtonDefaultValues = ButtonDefaultValues
> implements ButtonOptions<E, D>
{
    id: number;
    runner: ButtonRunner<E>;
    defaultValues?: D;

    constructor(opts: ButtonOptions<E, D>) {
        this.id = opts.id;
        this.runner = opts.runner;
        if (opts.defaultValues) this.defaultValues = opts.defaultValues;
    }

    toAPI(opts: ButtonToAPIOptions<D>): APIButtonComponentWithCustomId {
        const button: APIButtonComponentWithCustomId = {
            type: ComponentType.Button,
            custom_id: String.fromCharCode(this.id) + (opts.data ?? ""),
            style: this.defaultValues?.style ?? ButtonStyle.Secondary,
        };

        if ("style" in opts && opts.style !== undefined) {
            button.style = opts.style as ButtonStyleNoLinkAndPremium;
        }

        if (opts.disabled !== undefined) {
            button.disabled = opts.disabled;
        } else if (this.defaultValues?.disabled !== undefined) {
            button.disabled = this.defaultValues.disabled;
        }

        if (opts.label !== undefined) {
            button.label = opts.label;
        } else if (this.defaultValues?.label !== undefined) {
            button.label = this.defaultValues.label;
        }

        if (opts.emoji !== undefined) {
            button.emoji = opts.emoji;
        } else if (this.defaultValues?.emoji !== undefined) {
            button.emoji = this.defaultValues.emoji;
        }

        return button;
    }

    toBuilder(opts: ButtonToAPIOptions<D>): ButtonBuilder {
        const builder = new ButtonBuilder();
        builder.setCustomId(String(this.id) + (opts.data ?? ""));

        const style =
            "style" in opts && opts.style !== undefined
                ? (opts.style as ButtonStyleNoLinkAndPremium)
                : this.defaultValues?.style ?? ButtonStyle.Secondary;
        builder.setStyle(style);

        const disabled =
            opts.disabled !== undefined
                ? opts.disabled
                : this.defaultValues?.disabled;
        if (disabled !== undefined) builder.setDisabled(disabled);

        const label = opts.label ?? this.defaultValues?.label;
        if (label !== undefined) builder.setLabel(label);

        const emoji = opts.emoji ?? this.defaultValues?.emoji;
        if (emoji !== undefined) builder.setEmoji(emoji);

        return builder;
    }
}
