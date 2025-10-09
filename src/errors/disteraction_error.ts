"use strict";

// Heavily inspired by node's `internal/errors` module
import { ErrorCodes } from "./error_codes.js";
import { messages } from "./messages.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => Error;
/**
 * Extend an error of some sort into a DisteractionError.
 */
function makeDisteractionError<TBase extends Constructor>(Base: TBase) {
    // @ts-expect-error TS is dumb
    return class DisteractionsError extends Base {
        code: ErrorCodes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(code: ErrorCodes, ...args: any[]) {
            super(message(code, args.slice(1)));
            this.code = code;
            Error.captureStackTrace?.(this, DisteractionsError);
        }

        get name() {
            return `${super.name} [${this.code}]`;
        }
    };
}

function message(code: ErrorCodes, args: unknown[]) {
    if (!(code in ErrorCodes))
        throw new Error("Error code must be a valid DiscordjsErrorCodes");
    const msg = messages[code];
    // @ts-expect-error TS is dumb
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (typeof msg === "function") return msg(...args);
    if (!args?.length) return msg;
    args.unshift(msg);
    return String(...args);
}

export const DisteractionsError = makeDisteractionError(Error);
export const DisteractionsTypeError = makeDisteractionError(TypeError);
export const DisteractionsRangeError = makeDisteractionError(RangeError);
