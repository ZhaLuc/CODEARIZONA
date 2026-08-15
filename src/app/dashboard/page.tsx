"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function DashboardRedirect() {
  const { user } = useApp();
  const router = useRouter();
  useEffect(() => {
    router.replace(user ? "/activity" : "/signin?next=/activity");
  }, [user, router]);
  return <p className="shell text-ink-soft">Opening your activity.</p>;
}
