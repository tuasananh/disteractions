import type { APIChannel } from "@discordjs/core/http-only";
import type { Env } from "hono";
import { Base } from "../base.js";

export class BaseChannel<E extends Env> extends Base<E> {
    declare rawData: APIChannel;
}
