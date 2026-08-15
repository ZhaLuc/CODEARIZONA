"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, PageHeader } from "@/components/ui";
import { bills } from "@/data/bills";
import { billStatusDetail, billStatusLabel, topicLabel } from "@/lib/format";

const groups = [
  { id: "", label: "All" },
  { id: "Proposed", label: "Proposed" },
  { id: "Active", label: "Active" },
  { id: "Passed / Enacted", label: "Passed / Enacted" },
  { id: "Other", label: "Other" },
];

export default function BillsPage() {
  const [status, setStatus] = useState("");
  const [topic, setTopic] = useState("");
  const rows = bills.filter((b) => (!status || billStatusLabel[b.status] === status) && (!topic || b.topic === topic));

  return (
    <div className="shell space-y-8">
      <PageHeader
        title="Policy"
        body="Official Arizona education bills, written in plain English. Last verified August 15, 2026. Always check azleg.gov for later actions."
      />
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setStatus(g.id)}
            className={`btn !min-h-10 text-sm ${status === g.id ? "btn-primary" : "btn-secondary"}`}
          >
            {g.label}
          </button>
        ))}
        <select className="field max-w-[200px]" value={topic} onChange={(e) => setTopic(e.target.value)}>
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
          <Link key={b.id} href={`/bills/${b.id}`} className="rounded-[22px] border border-line bg-surface p-5 transition hover:shadow-[var(--shadow-2)]">
            <div className="flex flex-wrap gap-2">
              <Badge tone={b.status === "enacted" ? "verified" : b.status === "vetoed" ? "danger" : "info"}>
                {billStatusLabel[b.status]}
              </Badge>
              <Badge tone="muted">{topicLabel[b.topic]}</Badge>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-faint">{b.number}</p>
            <h2 className="display mt-1 text-3xl leading-tight">{b.title}</h2>
            <p className="mt-2 line-clamp-4 text-sm text-ink-soft">{b.plainLanguage}</p>
            <p className="mt-3 text-xs text-ink-faint">
              {billStatusDetail[b.status]} · last verified {b.lastVerified}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
