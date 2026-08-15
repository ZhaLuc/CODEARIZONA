"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldLabel, PageHeader } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";

export default function SignUpPage() {
  const { signUp } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("community");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="shell max-w-lg space-y-8">
      <PageHeader title="Create an account" body="Choose a role. Teachers verify incoming items. Community members submit fulfillment." />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = signUp({ name, email, password, role });
          if (!result.ok) {
            setError(result.message);
            return;
          }
          router.push("/activity");
        }}
      >
        <fieldset className="grid grid-cols-2 gap-2">
          <legend className="mb-2 text-sm font-medium">I am a</legend>
          {(["community", "teacher"] as const).map((r) => (
            <label key={r} className={`btn ${role === r ? "btn-primary" : "btn-secondary"}`}>
              <input type="radio" className="sr-only" checked={role === r} onChange={() => setRole(r)} />
              {r === "teacher" ? "Teacher" : "Community member"}
            </label>
          ))}
        </fieldset>
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <input id="name" className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" type="email" className="field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <input id="password" type="password" className="field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Create account
        </button>
      </form>
      <p className="text-sm text-ink-soft">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/signin">
          Sign in
        </Link>
      </p>
    </div>
  );
}
