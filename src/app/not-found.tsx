export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="display text-5xl">That page isn’t on the map.</p>
      <p className="mt-3 text-ink-soft">This prototype only includes the seeded demo routes.</p>
      <a href="/" className="mt-6 inline-block rounded-full bg-ink px-4 py-2 text-[color:var(--paper)]">
        Back to Meridian
      </a>
    </div>
  );
}
