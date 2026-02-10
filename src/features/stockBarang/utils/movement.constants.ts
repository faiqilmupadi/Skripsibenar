export const allowedMovementTypes = ["101", "261", "Z48"] as const;

export type AllowedMovementType = (typeof allowedMovementTypes)[number];

export const movementTypeByAction = {
  order: "101",
  qc: "101",
  withdraw: "261",
  claimVendor: "Z48"
} as const;

export function isAllowedMovementType(value: string): value is AllowedMovementType {
  return allowedMovementTypes.includes(value as AllowedMovementType);
}
