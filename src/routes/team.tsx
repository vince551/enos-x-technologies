import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site";
import { team } from "@/data/team";

const portraitBackgrounds = [
  "from-sky-500/25 via-blue-700/35 to-slate-950",
  "from-cyan-500/25 via-blue-700/35 to-slate-950",
  "from-sky-400/25 via-cyan-700/30 to-slate-950",
  "from-blue-500/30 via-slate-700/35 to-slate-950",
  "from-sky-500/30 via-blue-800/35 to-slate-950",
] as const;

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Leadership — ENOSX Technologies" },
      {
        name: "description",
        content: "Meet the people leading and supporting the work at ENOSX Technologies.",
      },
      { property: "og:title", content: "Leadership — ENOSX Technologies" },
      { property: "og:description", content: "Meet the people behind ENOSX Technologies." },
    ],
  }),
  component: Team,
});

function Team() {
  return (
    <>
      <section className="cinematic-page-hero relative overflow-hidden border-b border-border pt-14">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              ENOSX Technologies
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Leadership</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Meet the people bringing leadership, growth, design and operations together.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-8 md:py-20">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(({ initials, name, role, responsibility, avatar }, index) => (
            <Reveal key={name}>
              <article>
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border border-border bg-gradient-to-br ${portraitBackgrounds[index % portraitBackgrounds.length]}`}
                >
                  <div
                    className="absolute -right-12 -top-10 h-56 w-56 rounded-full border border-white/10"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -right-7 -top-5 h-40 w-40 rounded-full border border-white/10"
                    aria-hidden="true"
                  />
                  <img
                    src={avatar}
                    alt={`${name} portrait`}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent"
                    aria-hidden="true"
                  />
                  <img
                    src="/enosx-logo.png"
                    alt=""
                    className="absolute -bottom-16 -right-14 w-[90%] opacity-20 mix-blend-screen"
                  />
                  <span
                    className="absolute bottom-4 right-4 font-display text-xs font-black tracking-[0.2em] text-white/70"
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                  <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                    ENOSX / LEADERSHIP
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold">{name}</h2>
                <p className="mt-1 text-sm font-semibold text-primary">{role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {responsibility}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
