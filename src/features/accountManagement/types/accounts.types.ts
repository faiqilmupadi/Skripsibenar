export type UserDbRow = {
  userId: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  createdOn: string;
  lastChange: string | null;
};

export type Account = {
  userId: number;
  username: string;
  email: string;
  role: string;
  createdOn: string;
  lastChange: string | null;
  status: "ACTIVE" | "INACTIVE";
};
