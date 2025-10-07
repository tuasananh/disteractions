import {
    ComponentType,
    type APILabelComponent,
    type APIModalInteractionResponseCallbackComponent,
    type APIModalInteractionResponseCallbackData,
    type APISelectMenuOption,
    type APIStringSelectComponent,
    type APITextDisplayComponent,
    type APITextInputComponent,
} from "@discordjs/core/http-only";
import { type Env } from "hono";
import type {
    MakeOptionalIfAllKeysAreOptional,
    MakeOptionalIfUndefined,
} from "../../../utils/index.js";
import type {
    ModalFields,
    ModalFieldToToAPIType,
    ModalTextDisplayField,
    StringSelectField,
    TextInputField,
} from "./fields.js";
import type { ModalRunner } from "./runner.js";
export * from "./fields.js";
export * from "./runner.js";

export type ModalOptions<E extends Env, Fields extends ModalFields> = {
    /**
     * A unique identifier for the modal in range [1, 65534].
     * This will determine what modal was clicked and call its handler.
     */
    id: number;
    /**
     * The title of the modal (max 45 characters).
     */
    title: string;
    /**
     * The fields of the modal.
     */
    fields: Fields;
    /**
     * The runner to be executed when the modal is submitted.
     */
    runner: ModalRunner<E, Fields>;
};

export type ModalToAPIOptions<Fields extends ModalFields> =
    MakeOptionalIfAllKeysAreOptional<{
        /**
         * Values to be passed to the modal fields when converting to API format.
         */
        component: MakeOptionalIfUndefined<{
            [K in keyof Fields]?: ModalFieldToToAPIType<Fields[K]>;
        }>;
        /**
         * Optional data to append to the custom_id of the modal. Maximum 99 characters.
         */
        data?: string;
    }>;

/**
 * A class representing a modal.
 */
export class Modal<E extends Env, Fields extends ModalFields = ModalFields>
    implements ModalOptions<E, Fields>
{
    id: number;
    title: string;
    fields: Fields;
    runner: ModalRunner<E, Fields>;

    constructor(opts: ModalOptions<E, Fields>) {
        this.id = opts.id;
        this.title = opts.title;
        this.fields = opts.fields;
        this.runner = opts.runner;
    }

    private makeTextDisplayField(
        field: ModalTextDisplayField
    ): APITextDisplayComponent {
        return {
            type: field.type,
            content: field.content,
        };
    }

    private makeTextInputField(
        name: string,
        field: TextInputField,
        optionalValue?: string
    ): APILabelComponent {
        const textInputComponent: APITextInputComponent = {
            custom_id: name,
            type: ComponentType.TextInput,
            style: field.style,
        };

        if (field.maxLength !== undefined)
            textInputComponent.max_length = field.maxLength;
        if (field.minLength !== undefined)
            textInputComponent.min_length = field.minLength;
        if (field.placeholder !== undefined)
            textInputComponent.placeholder = field.placeholder;

        if (field.required !== undefined)
            textInputComponent.required = field.required;
        else textInputComponent.required = false; // Make it false because i prefer it that way.

        if (optionalValue !== undefined) {
            textInputComponent.value = optionalValue;
        } else if (field.defaultValue !== undefined)
            textInputComponent.value = field.defaultValue;

        const label: APILabelComponent = {
            type: ComponentType.Label,
            label: field.label,
            component: textInputComponent,
        };

        if (field.description !== undefined)
            label.description = field.description;

        return label;
    }

    private makeStringSelectField(
        name: string,
        field: StringSelectField,
        optionalValue?: APISelectMenuOption[]
    ): APILabelComponent {
        const stringSelectComponent: APIStringSelectComponent = {
            custom_id: name,
            type: ComponentType.StringSelect,
            options: field.defaultOptions ?? [],
        };

        if (field.maxValues !== undefined)
            stringSelectComponent.max_values = field.maxValues;
        if (field.minValues !== undefined)
            stringSelectComponent.min_values = field.minValues;
        if (field.placeholder !== undefined)
            stringSelectComponent.placeholder = field.placeholder;

        if (field.required !== undefined)
            stringSelectComponent.required = field.required;
        else stringSelectComponent.required = false; // Make it false because i prefer it that way.

        if (optionalValue !== undefined) {
            stringSelectComponent.options = optionalValue;
        }

        const label: APILabelComponent = {
            type: ComponentType.Label,
            label: field.label,
            component: stringSelectComponent,
        };

        if (field.description !== undefined)
            label.description = field.description;

        return label;
    }

    /**
     * Converts the modal to API format for sending.
     *
     * @param opts - The options to convert the modal to API format.
     * @returns
     */
    toAPI(
        opts: ModalToAPIOptions<Fields>
    ): APIModalInteractionResponseCallbackData {
        const optionalValues: Record<
            string,
            APISelectMenuOption[] | string | undefined
        > =
            "component" in opts
                ? (opts.component as Record<
                      string,
                      APISelectMenuOption[] | string | undefined
                  >)
                : {};
        return {
            custom_id: String.fromCharCode(this.id) + (opts.data ?? ""),
            title: this.title,
            components: Object.entries(this.fields).map(
                ([
                    name,
                    component,
                ]): APIModalInteractionResponseCallbackComponent => {
                    switch (component.type) {
                        case ComponentType.TextDisplay:
                            return this.makeTextDisplayField(component);
                        case ComponentType.TextInput: {
                            const optionalValue =
                                name in optionalValues
                                    ? (optionalValues[name] as
                                          | string
                                          | undefined)
                                    : undefined;
                            return this.makeTextInputField(
                                name,
                                component,
                                optionalValue
                            );
                        }
                        case ComponentType.StringSelect: {
                            const optionalValue =
                                name in optionalValues
                                    ? (optionalValues[name] as
                                          | APISelectMenuOption[]
                                          | undefined)
                                    : undefined;
                            return this.makeStringSelectField(
                                name,
                                component,
                                optionalValue
                            );
                        }
                    }
                }
            ),
        };
    }
}
