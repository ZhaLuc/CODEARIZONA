import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-20 text-center">
      <p className="display text-5xl">That page is not on the map.</p>
      <p className="mt-3 text-ink-soft">Try Explore, Policy, or a classroom remaining-need page.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Back to Meridian
      </Link>
    </div>
  );
}
