"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, SourceTag } from "@/components/ui";
import { bills } from "@/data/bills";
import { billStatusLabel, topicLabel } from "@/lib/format";

export default function BillsPage() {
  const [status, setStatus] = useState("");
  const [topic, setTopic] = useState("");
  const rows = bills.filter((b) => (!status || b.status === status) && (!topic || b.topic === topic));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <SourceTag kind="law" />
        <Badge tone="sand">Nonpartisan · official sources</Badge>
      </div>
      <h1 className="display text-5xl">What is changing in Arizona education law?</h1>
      <p className="max-w-2xl text-ink-soft">
        Plain English, then the official text. Meridian does not tell you how to vote, score bills as good or bad, or send a message in your name. Last verified August 15, 2026.
      </p>
      <div className="flex flex-wrap gap-2">
        <select className="rounded-full border border-line bg-transparent px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="introduced">Introduced</option>
          <option value="in-committee">In committee</option>
          <option value="enacted">Enacted</option>
          <option value="vetoed">Vetoed</option>
        </select>
        <select className="rounded-full border border-line bg-transparent px-3 py-2 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          <option value="career-technical">Career & technical</option>
          <option value="teacher-workforce">Teacher workforce</option>
          <option value="school-funding">School funding</option>
          <option value="special-education">Special education</option>
          <option value="curriculum">Curriculum</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((b) => (
          <Link key={b.id} href={`/bills/${b.id}`} className="rounded-3xl border border-line p-5 hover:shadow-[var(--shadow)]">
            <div className="flex flex-wrap gap-2">
              <Badge tone={b.status === "enacted" ? "juniper" : b.status === "vetoed" ? "clay" : "civic"}>
                {billStatusLabel[b.status]}
              </Badge>
              <Badge tone="sand">{topicLabel[b.topic]}</Badge>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-soft">{b.number}</p>
            <h2 className="display mt-1 text-3xl leading-tight">{b.title}</h2>
            <p className="mt-2 line-clamp-4 text-sm text-ink-soft">{b.plainLanguage}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
