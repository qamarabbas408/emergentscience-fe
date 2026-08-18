import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const STATS = [
  { value: '3.9M', label: 'researchers worldwide' },
  { value: '16M', label: 'citations received' },
  { value: '5.3B', label: 'article views' },
]

const AUDIENCES = ['Authors', 'Editors & reviewers', 'Collaborators']

const FEATURES = [
  { title: 'Find a journal', desc: 'Browse 100+ journals across every field of science.' },
  { title: 'Submit your research', desc: 'A guided, fast submission flow with transparent status.' },
  { title: 'Peer review', desc: 'Collaborative, interactive review with named reviewers.' },
  { title: 'Find a topic', desc: 'Discover cross-journal topics and permanent collections.' },
  { title: 'Resources for authors', desc: 'Publishing guides, style help and open-access advice.' },
  { title: 'Press office', desc: 'Highlights of the latest research for journalists.' },
]

const NEWS = [
  { tag: 'Research highlight', title: 'New insights into climate resilience of coastal systems' },
  { tag: 'Journal news', title: 'Our new journal of digital medicine opens for submissions' },
  { tag: 'Community', title: 'Interactive review celebrates 10 years of open discussion' },
]

export function Landing() {
  return (
    <div>
      <Header />

      <main>
        <section className="relative flex min-h-[640px] items-end overflow-hidden text-white">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2400&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/80 via-primary/60 to-primary-hover/80" />
          <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-16 pt-16">
            <h1 className="max-w-[670px] text-5xl font-medium leading-[1.2] tracking-tight lg:text-6xl">
              Where scientists empower society
            </h1>
            <p className="mt-3 max-w-xl text-lg font-light text-white/85">
              Creating solutions for healthy lives on a healthy planet through open, rigorously
              peer-reviewed research.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/20 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-medium">{stat.value}</p>
                  <p className="text-sm font-light text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-10">
          <div className="flex gap-6 border-b border-border">
            {AUDIENCES.map((audience) => (
              <button
                key={audience}
                className="-mb-px border-b-2 border-primary pb-3 text-sm font-bold text-primary"
              >
                {audience}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto grid max-w-[1280px] gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-card bg-white p-8 transition-shadow duration-300 hover:shadow-card"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-tint" />
                <h3 className="mt-5 text-lg font-medium text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-ink-secondary">
                  {feature.desc}
                </p>
                <a href="#" className="mt-4 inline-block text-sm font-bold text-primary">
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary-deep py-20 text-white">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-8 px-6">
            <div>
              <h2 className="text-3xl font-medium tracking-tight">
                Peer review that opens up, not shuts down
              </h2>
              <p className="mt-3 max-w-lg font-light text-white/70">
                Authors, reviewers and editors discuss research in a live, threaded forum until
                consensus is reached — then reviewers are named on the article.
              </p>
            </div>
            <a
              href="#"
              className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary-deep transition-colors hover:bg-sky"
            >
              See how review works
            </a>
          </div>
        </section>

        <section className="bg-body py-16">
          <div className="mx-auto max-w-[1280px] px-6">
            <h2 className="text-3xl font-medium tracking-tight text-ink">Latest news</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {NEWS.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-card bg-white transition-shadow duration-300 hover:shadow-card"
                >
                  <div className="h-36 bg-gradient-to-br from-sky to-primary-tint" />
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-sky">
                      {item.tag}
                    </p>
                    <h3 className="mt-2 font-medium leading-snug text-ink">{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-medium tracking-tight text-ink">
              Stay up to date with our research
            </h2>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full flex-1 rounded-full border border-border bg-body px-6 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}