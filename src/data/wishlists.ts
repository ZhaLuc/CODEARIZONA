import type { Wishlist } from "@/lib/types";

export const wishlists: Wishlist[] = [
  {
    id: "wish-maria",
    teacherId: "teacher-maria",
    title: "STEM lab, later this year",
    intro:
      "These are not this month's labs. They are the materials that would let the weather unit grow into a year-long measurement practice.",
    items: [
      {
        id: "w-anemometer",
        name: "Classroom anemometer",
        quantity: 2,
        priority: "needed",
        note: "For outdoor wind observations after the thermometer labs.",
      },
      {
        id: "w-tablets",
        name: "Used-but-working tablets for data entry",
        quantity: 4,
        priority: "nice-to-have",
        note: "Only if they can be school-managed. No student personal devices.",
      },
      {
        id: "w-storage",
        name: "Labeled bin set for lab stations",
        quantity: 6,
        priority: "nice-to-have",
        note: "Keeps thermometers from migrating into other classrooms.",
      },
    ],
  },
  {
    id: "wish-james",
    teacherId: "teacher-james",
    title: "Quiet-room upgrades",
    intro: "Longer-horizon supports. Not required to open school.",
    items: [
      {
        id: "w-lamp",
        name: "Adjustable desk lamps",
        quantity: 4,
        priority: "needed",
        note: "Task lighting for students who work better with a smaller field.",
      },
      {
        id: "w-chairs",
        name: "Flexible seating stools",
        quantity: 6,
        priority: "nice-to-have",
        note: "Replacements as current stools wear down.",
      },
    ],
  },
  {
    id: "wish-david",
    teacherId: "teacher-david",
    title: "Shop extras",
    intro: "If the measuring kit is filled, these would expand what students can build.",
    items: [
      {
        id: "w-clamps",
        name: "Bar clamps",
        quantity: 10,
        priority: "needed",
        note: "Hold work so students are not using their hands as vises.",
      },
      {
        id: "w-safety",
        name: "Shop safety glasses (class set)",
        quantity: 24,
        priority: "needed",
        note: "Always the next restock after tools.",
      },
    ],
  },
];
