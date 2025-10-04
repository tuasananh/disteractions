import type {
    APISelectMenuOption,
    ComponentType,
    TextInputStyle,
} from "@discordjs/core/http-only";

export type ModalFieldToType<T extends ComponentType> =
    T extends ComponentType.TextDisplay
        ? undefined
        : T extends ComponentType.TextInput
        ? string
        : T extends ComponentType.StringSelect
        ? string[]
        : never;

// We need TextDisplay, TextInput,
export type TextDisplayField = {
    type: ComponentType.TextDisplay;
    content: string;
};

type SharedLabel = {
    label: string;
    description?: string;
};

type SharedPlaceholder = {
    placeholder?: string;
};

type SharedRequired =
    | {
          required: true;
      }
    | {
          required?: false;
      };

type FieldBase<T extends ComponentType> = {
    type: T;
} & SharedRequired;

export type TextInputField = SharedLabel &
    FieldBase<ComponentType.TextInput> &
    SharedPlaceholder & {
        style: TextInputStyle;
        minLength?: number;
        maxLength?: number;
        defaultValue?: string;
    };

type SelectField<T extends ComponentType> = SharedLabel &
    FieldBase<T> &
    SharedPlaceholder & {
        minValues?: number;
        maxValues?: number;
        defaultOptions?: APISelectMenuOption[];
    };

export type StringSelectField = SelectField<ComponentType.StringSelect>;

type ModalField = TextDisplayField | TextInputField | StringSelectField;

export type ModalFieldToToAPIType<F extends ModalField> =
    F extends TextDisplayField
        ? undefined
        : F extends TextInputField
        ? F["defaultValue"] extends string
            ? string | undefined
            : string
        : F extends StringSelectField
        ? F["defaultOptions"] extends APISelectMenuOption[]
            ? APISelectMenuOption[] | undefined
            : APISelectMenuOption[]
        : never;

export type ModalFields = Record<string, ModalField>;
