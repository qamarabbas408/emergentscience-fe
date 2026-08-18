const LINK_GROUPS = [
  {
    title: 'Guidelines',
    links: ['For authors', 'For editors', 'For reviewers', 'Ethics & COPE'],
  },
  {
    title: 'Explore',
    links: ['All journals', 'Special issues', 'Topics', 'Article collections'],
  },
  {
    title: 'Outreach',
    links: ['News', 'Events', 'Press office', 'Careers'],
  },
  {
    title: 'Connect',
    links: ['Contact', 'Help center', 'Social media', 'Newsletter'],
  },
]

export function Footer() {
  return (
    <footer className="bg-primary-deep text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="text-xl font-bold">Emergent&nbsp;Science</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Open access publisher of rigorously peer-reviewed research across the spectrum of
            science.
          </p>
        </div>
        {LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-bold">{group.title}</p>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1280px] px-6 py-4 text-xs text-white/40">
          © 2026 Emergent Science. All rights reserved.
        </p>
      </div>
    </footer>
  )
}