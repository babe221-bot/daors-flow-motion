export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const users: User[] = [
  { id: "1", email: "admin@example.com", name: "Admin User", role: "admin" },
  { id: "2", email: "customer@example.com", name: "Customer User", role: "customer" },
];

export const getUserByEmail = (email: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((user) => user.email === email);
      resolve(user);
    }, 500);
  });
};
