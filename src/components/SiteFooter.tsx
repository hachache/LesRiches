import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-[rgba(255,250,240,0.52)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <p className="display-type text-3xl font-medium uppercase">L'Écart</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Des ordres de grandeur pour comprendre les fortunes extrêmes, sans slogan ni raccourci fiscal.
          </p>
        </div>
        <nav aria-label="Navigation de pied de page" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link className="transition-colors hover:text-[var(--accent-dark)]" href="/comparateur">Comparer</Link>
          <Link className="transition-colors hover:text-[var(--accent-dark)]" href="/milliardaires">Fortunes</Link>
          <Link className="transition-colors hover:text-[var(--accent-dark)]" href="/methodologie">Méthodologie</Link>
        </nav>
      </div>
    </footer>
  );
}
