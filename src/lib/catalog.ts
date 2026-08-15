import { bills } from "@/data/bills";
import { requests } from "@/data/requests";
import { schools } from "@/data/schools";
import { teachers } from "@/data/teachers";
import { wishlists } from "@/data/wishlists";
import { liveItems, priorityScore, requestTotals } from "./fulfillment";
import type { DemoContribution } from "./types";

export function schoolById(id: string) {
  return schools.find((s) => s.id === id);
}

export function teacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

export function requestById(id: string) {
  return requests.find((r) => r.id === id);
}

export function billById(id: string) {
  return bills.find((b) => b.id === id);
}

export function teacherBySchool(schoolId: string) {
  return teachers.filter((t) => t.schoolId === schoolId);
}

export function requestsByTeacher(teacherId: string) {
  return requests.filter((r) => r.teacherId === teacherId);
}

export function wishlistByTeacher(teacherId: string) {
  return wishlists.find((w) => w.teacherId === teacherId);
}

export function hydrateRequest(requestId: string, contributions: DemoContribution[]) {
  const request = requestById(requestId);
  if (!request) return null;
  const teacher = teacherById(request.teacherId);
  const school = schoolById(request.schoolId);
  if (!teacher || !school) return null;
  const items = liveItems(request, contributions);
  const totals = requestTotals(items);
  const daysOpen = Math.max(
    1,
    Math.round((Date.parse("2026-08-15") - Date.parse(request.createdAt)) / 86400000),
  );
  const priority = priorityScore(totals.remaining, request.urgency, school.region, daysOpen);
  return { request, teacher, school, items, totals, daysOpen, priority };
}

export function allHydrated(contributions: DemoContribution[]) {
  return requests
    .map((r) => hydrateRequest(r.id, contributions))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
}

export const cities = [...new Set(schools.map((s) => s.city))].sort();
export const categories = [...new Set(requests.map((r) => r.category))].sort();
export const regions = [...new Set(schools.map((s) => s.region))].sort();
