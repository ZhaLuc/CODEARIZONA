export type SchoolType = "district" | "charter" | "bureau";
export type RequestStatus = "open" | "partial" | "fulfilled" | "closed";
export type ItemStatus = "open" | "partial" | "fulfilled";
export type Urgency = "urgent" | "needed" | "wishlist";
export type WishlistPriority = "needed" | "nice-to-have";
export type BillStatus =
  | "introduced"
  | "in-committee"
  | "house-passed"
  | "enacted"
  | "vetoed"
  | "failed";
export type BillTopic =
  | "school-funding"
  | "career-technical"
  | "teacher-workforce"
  | "curriculum"
  | "special-education";
export type Role = "teacher" | "community" | "admin";
export type FulfillmentChannel = "in_person" | "wishlist_shipment";
export type FulfillmentStatus = "submitted" | "under_review" | "verified" | "needs_attention";

export type School = {
  id: string;
  name: string;
  type: SchoolType;
  city: string;
  county: string;
  region: string;
  lat: number;
  lng: number;
  verified: boolean;
  notes: string;
};

export type Teacher = {
  id: string;
  name: string;
  schoolId: string;
  subjects: string[];
  gradeLevels: string;
  bio: string;
  classroom: string;
  initials: string;
  accent: string;
  verified: boolean;
  verificationNote: string;
  yearsTeaching: number;
};

export type RequestItem = {
  id: string;
  name: string;
  quantityNeeded: number;
  quantitySeedFulfilled: number;
  unit: string;
  why: string;
};

export type FulfillmentEvent = {
  id: string;
  donorLabel: string;
  itemId: string;
  quantity: number;
  date: string;
  isYou?: boolean;
};

export type ClassroomRequest = {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  purpose: string;
  story: string;
  category: string;
  urgency: Urgency;
  createdAt: string;
  targetDate: string;
  status: RequestStatus;
  items: RequestItem[];
  history: FulfillmentEvent[];
  relatedBillIds: string[];
  accepting: boolean;
};

export type WishlistItem = {
  id: string;
  name: string;
  quantity: number;
  priority: WishlistPriority;
  note: string;
  shopUrl?: string;
};

export type Wishlist = {
  id: string;
  teacherId: string;
  title: string;
  intro: string;
  items: WishlistItem[];
};

export type BillEvent = {
  date: string;
  label: string;
  source: string;
};

export type Bill = {
  id: string;
  number: string;
  title: string;
  status: BillStatus;
  session: string;
  topic: BillTopic;
  officialSummary: string;
  plainLanguage: string;
  impactTeachers: string;
  impactStudents: string;
  impactFamilies: string;
  impactSchools: string;
  supportersArgue: string;
  opponentsArgue: string;
  timeline: BillEvent[];
  officialUrl: string;
  factSheetUrl?: string;
  lastVerified: string;
  sourceNote: string;
};

export type Account = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  teacherId?: string;
};

export type EvidenceFile = {
  fileName: string;
  fileKind: "image" | "pdf";
  sizeLabel: string;
};

export type LiveFulfillment = {
  id: string;
  actorId: string;
  actorName: string;
  teacherId: string;
  requestId?: string;
  wishlistId?: string;
  itemId: string;
  itemName: string;
  quantity: number;
  channel: FulfillmentChannel;
  status: FulfillmentStatus;
  at: string;
  destination: string;
  evidence?: EvidenceFile;
  teacherNote?: string;
};

export type LastAction = {
  eventId: string;
  itemName: string;
  quantity: number;
  needed: number;
  verified: number;
  pending: number;
  remaining: number;
  remainingAfterPending: number;
  kind: "submitted" | "verified" | "rejected";
};
