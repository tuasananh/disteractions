import type {
    APISelectMenuOption,
    ComponentType,
    TextInputStyle,
} from "@discordjs/core/http-only";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Modal } from "./index.js";

export type ValidModalFieldType =
    | ComponentType.TextInput
    | ComponentType.TextDisplay
    | ComponentType.StringSelect;
/**
 * Maps a modal field type to its corresponding TypeScript type.
 *
 * - TextDisplay fields do not have a value and thus map to `undefined`.
 * - TextInput fields map to `string`.
 * - StringSelect fields map to an array of strings (`string[]`).
 */
export type ModalFieldToType<T extends ValidModalFieldType> =
    T extends ComponentType.TextDisplay
        ? undefined
        : T extends ComponentType.TextInput
        ? string
        : T extends ComponentType.StringSelect
        ? string[]
        : never;

export type ModalFieldBase<T extends ValidModalFieldType> = {
    /**
     * The type of the modal field component.
     *
     * - {@link ComponentType.TextInput} represents a text input field.
     * - {@link ComponentType.TextDisplay} represents a text display field.
     * - {@link ComponentType.StringSelect} represents a string select field.
     */
    type: T;
};

/**
 * The type representing a text display field in a modal.
 */
export type ModalTextDisplayField =
    ModalFieldBase<ComponentType.TextDisplay> & {
        /**
         * The content to be displayed in the text display field.
         *
         * Can include markdown formatting.
         */
        content: string;
    };

export type ModalFieldSharedLabel = {
    /**
     * The label for the modal field.
     */
    label: string;
    /**
     * The description for the modal field.
     */
    description?: string;
};

export type ModalFieldSharedPlaceholder = {
    /**
     * The placeholder text for the modal field. Maximum 100 characters.
     */
    placeholder?: string;
};

export type ModalFieldSharedRequired =
    | {
          /**
           * Whether the modal field is required. Defaults to false.
           */
          required: true;
      }
    | {
          /**
           * Whether the modal field is required. Defaults to false.
           */
          required?: false;
      };

export type ModalFieldBaseRequired<T extends ValidModalFieldType> =
    ModalFieldBase<T> & ModalFieldSharedRequired;

/**
 * The type representing a text input field in a modal.
 */
export type TextInputField = ModalFieldSharedLabel &
    ModalFieldBaseRequired<ComponentType.TextInput> &
    ModalFieldSharedPlaceholder & {
        /**
         * The style of the text input field.
         *
         * {@link TextInputStyle.Short} represents a single-line text input.
         * {@link TextInputStyle.Paragraph} represents a multi-line text input.
         */
        style: TextInputStyle;
        /**
         * The minimum length of the text input. Must be between 0 and 4000.
         */
        minLength?: number;
        /**
         * The maximum length of the text input. Must be between 1 and 4000.
         */
        maxLength?: number;
        /**
         * The default value to be pre-filled in the text input.
         * Must be valid with respect to `minLength` and `maxLength`.
         */
        defaultValue?: string;
    };

export type SelectField<T extends ValidModalFieldType> = ModalFieldSharedLabel &
    ModalFieldBaseRequired<T> &
    ModalFieldSharedPlaceholder & {
        /**
         * The minimum number of options that must be selected.
         * Must be between 0 and 25.
         * Defaults to 1.
         */
        minValues?: number;
        /**
         * The maximum number of options that can be selected.
         * Must be between 1 and 25.
         * Defaults to 1.
         */
        maxValues?: number;
        /**
         * The default list of options to be sent.
         *
         * If this is provided, you may not need to pass in the options
         * when calling {@link Modal.toAPI}
         */
        defaultOptions?: APISelectMenuOption[];
    };

/**
 * The type representing a string select field in a modal.
 */
export type StringSelectField = SelectField<ComponentType.StringSelect>;

export type ModalField =
    | ModalTextDisplayField
    | TextInputField
    | StringSelectField;

/**
 * Maps a modal field definition to its corresponding API type.
 */
export type ModalFieldToToAPIType<F extends ModalField> =
    F extends ModalTextDisplayField
        ? undefined
        : F extends TextInputField
        ? string | undefined
        : F extends StringSelectField
        ? F["defaultOptions"] extends APISelectMenuOption[]
            ? APISelectMenuOption[] | undefined
            : APISelectMenuOption[]
        : never;

/**
 * The type representing a collection of modal fields.
 */
export type ModalFields = Record<string, ModalField>;
