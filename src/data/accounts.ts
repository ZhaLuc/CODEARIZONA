import type { Account } from "@/lib/types";

export const seededAccounts: Account[] = [
  {
    id: "user-maria",
    email: "maria.hernandez@isaacms.az",
    name: "Maria Hernandez",
    password: "meridian",
    role: "teacher",
    teacherId: "teacher-maria",
  },
  {
    id: "user-jordan",
    email: "jordan.lee@phoenix.az",
    name: "Jordan Lee",
    password: "meridian",
    role: "community",
  },
  {
    id: "user-staff",
    email: "staff@meridian.az",
    name: "Meridian staff",
    password: "meridian",
    role: "admin",
  },
];
