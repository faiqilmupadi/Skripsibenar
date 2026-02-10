export const ALLOWED_MOVEMENT_TYPES = ["101", "261", "Z48"] as const;

export type MovementType = (typeof ALLOWED_MOVEMENT_TYPES)[number];

const allowedSet = new Set<string>(ALLOWED_MOVEMENT_TYPES);

export function isAllowedMovementType(value: unknown): value is MovementType {
  return typeof value === "string" && allowedSet.has(value);
}

export function assertMovementType(value: unknown): MovementType {
  if (!isAllowedMovementType(value)) {
    throw new Error(`Invalid movementType: ${String(value)}`);
  }
  return value;
}
