import { category } from "./category";
import { homepage } from "./homepage";
import { order } from "./order";
import { product } from "./product";

export const schemaTypes = [homepage, product, category, order];

/** Types with exactly one document (ID = type name); hidden from "Create". */
export const SINGLETON_TYPES = new Set(["homepage"]);
