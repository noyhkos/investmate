// Discriminated union returned by every server action.
// Success branch spreads T so callers destructure `{ ok, id }`.
export type ActionResult<T extends object = object> =
  | (T & { ok: true })
  | { ok: false; error: string };
