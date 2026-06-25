import { user } from "./auth.schema";
import { payment } from "./app.schema";

export type User = typeof user.$inferSelect;
export type Payment = typeof payment.$inferSelect;