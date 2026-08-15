/** Factual adjacency copy. Never claims a bill funds or governs a seeded classroom. */
export function whyThisBill(requestId: string, billId: string) {
  const map: Record<string, Record<string, string>> = {
    "req-weather-lab": {
      "hb-2316":
        "This is a 7th-grade science and STEM lab. HB 2316 is introduced legislation about whether Arizona middle schools may offer CTE courses that count toward 8th-grade promotion and high school graduation. It does not fund this weather lab. Later bill actions after January 21, 2026 should be checked on azleg.gov.",
      "hb-4163":
        "HB 4163 is the enacted FY 2027 K-12 budget-reconciliation bill. It updates the per-student base used in school operating budgets, which is where classroom materials are typically paid for. It does not name this campus or create a supply program.",
    },
    "req-adaptive": {
      "hb-2621":
        "This classroom is a special-education resource room. HB 2621 (Chapter 102) is about special-education access for pupils in unorganized territory and certain placements. It does not change this Flagstaff classroom's materials list.",
    },
    "req-shop": {
      "hb-2316":
        "This is a CTE / intro-engineering shop. HB 2316 concerns middle-school CTE course permission. Window Rock High School is a high school; the bill is listed for topic overlap, not because it funds this kit.",
      "sb-1101":
        "SB 1101 is an introduced STEM/CTE teacher-capacity pilot with narrow district eligibility. It is listed because this is a CTE classroom, not because this campus is named in the bill.",
    },
  };
  return (
    map[requestId]?.[billId] ??
    "Listed because this classroom's subject overlaps the bill's education topic. That is adjacency, not a claim that the bill funds, names, or governs this specific request."
  );
}
