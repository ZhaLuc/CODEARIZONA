"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { seededAccounts } from "@/data/accounts";
import { FieldLabel, PageHeader } from "@/components/ui";
import { useApp } from "@/lib/store";

function SignInForm() {
  const { signIn, signInAs } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/activity";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function go() {
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(next);
  }

  return (
    <div className="shell max-w-lg space-y-8">
      <PageHeader title="Sign in" body="Community members submit fulfillment. Teachers verify what arrived." />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" type="email" autoComplete="email" className="field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <input id="password" type="password" autoComplete="current-password" className="field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Sign in
        </button>
      </form>
      <div className="space-y-2">
        <p className="text-sm text-ink-soft">Continue with an existing account</p>
        {seededAccounts
          .filter((a) => a.role !== "admin")
          .map((a) => (
            <button
              key={a.id}
              type="button"
              className="btn btn-secondary w-full justify-between"
              onClick={() => {
                signInAs(a.id);
                router.push(next);
              }}
            >
              <span>{a.name}</span>
              <span className="text-ink-faint">{a.role === "teacher" ? "Teacher" : "Community member"}</span>
            </button>
          ))}
      </div>
      <p className="text-sm text-ink-soft">
        New here?{" "}
        <Link className="underline underline-offset-4" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<p className="shell text-ink-soft">Loading sign in.</p>}>
      <SignInForm />
    </Suspense>
  );
}
