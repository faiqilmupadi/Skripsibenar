import { Account, UserDbRow } from "@/features/accountManagement/types/accounts.types";

export function mapAccountRow(row: UserDbRow): Account {
  return {
    userId: Number(row.userId),
    username: row.username,
    email: row.email,
    role: row.role,
    createdOn: row.createdOn,
    lastChange: row.lastChange,
    status: "ACTIVE"
  };
}

export const accountStatusText = (x: string) => (x === "ACTIVE" ? "Aktif" : "Nonaktif");
