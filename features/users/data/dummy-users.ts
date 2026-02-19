import type { User } from "../types"

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    isVerified: true,
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    isVerified: false,
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date("2024-02-20").toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    isVerified: true,
    createdAt: new Date("2024-03-10").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString(),
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    isVerified: false,
    createdAt: new Date("2024-04-05").toISOString(),
    updatedAt: new Date("2024-04-05").toISOString(),
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    isVerified: false,
    createdAt: new Date("2024-05-12").toISOString(),
    updatedAt: new Date("2024-05-12").toISOString(),
  },
]

