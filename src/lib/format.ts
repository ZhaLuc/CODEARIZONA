export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function remainingCopy(n: number, unit: string, name: string) {
  if (n <= 0) return `${name} fulfilled`;
  return `${n} ${unit === "each" ? "" : unit} ${name.toLowerCase()} still needed`.replace(/\s+/g, " ").trim();
}

export function formatStamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const billStatusLabel: Record<string, string> = {
  introduced: "Proposed",
  "in-committee": "Active",
  "house-passed": "Active",
  enacted: "Passed / Enacted",
  vetoed: "Other",
  failed: "Other",
};

export const billStatusDetail: Record<string, string> = {
  introduced: "Introduced",
  "in-committee": "In committee",
  "house-passed": "Passed House",
  enacted: "Enacted",
  vetoed: "Vetoed",
  failed: "Failed",
};

export const topicLabel: Record<string, string> = {
  "school-funding": "School funding",
  "career-technical": "Career & technical",
  "teacher-workforce": "Teacher workforce",
  curriculum: "Curriculum",
  "special-education": "Special education",
};
