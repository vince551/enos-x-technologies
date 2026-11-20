
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();

    let w = 0;
    let h = 0;
    let raf = 0;

    const pts = Array.from(
      { length: reducedMotion ? 0 : mobile ? 28 : 55 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
      }),
    );

    const resize = () => {
      const rect = c.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

      w = rect.width;
      h = rect.height;
      c.width = w * ratio;
      c.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = ctx.fillStyle = color;

      for (const p of pts) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;

        ctx.globalAlpha = 0.5;
        ctx.fillRect(a.x * w, a.y * h, 2, 2);

        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!;
          const d = Math.hypot(
            (a.x - b.x) * w,
            (a.y - b.y) * h,
          );

          if (d < 140) {
            ctx.globalAlpha = 0.18 * (1 - d / 140);
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/solutions", label: "Solutions" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label="ENOSX Technologies"
    >
      <img
        src="/enosx-logo.png"
        alt=""
        className="h-8 w-8 shrink-0 object-contain"
      />
      <span className="font-display text-lg font-black tracking-tight">
        ENOS<span className="text-primary">X</span>
      </span>
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="enosx-header fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          aria-label="ENOSX Technologies home"
          onClick={() => setMenuOpen(false)}
          className="shrink-0"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Main navigation"
          className="enosx-desktop-nav hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground" }}
              className="rounded-full px-4 py-2.5 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="ml-auto hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110 md:inline-flex"
        >
          Start a project
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="enosx-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="enosx-menu-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground transition hover:border-primary/60 hover:bg-white/10 md:hidden"
        >
          <span className="flex w-5 flex-col gap-[5px]">
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="enosx-mobile-navigation"
        className={`enosx-mobile-menu absolute inset-x-3 top-[calc(100%+0.65rem)] overflow-hidden rounded-2xl p-3 transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{
                className: "bg-primary/15 text-primary",
              }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/contact"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-xl bg-primary px-4 py-3.5 text-center text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Technology built in Africa, for the world.
          </p>
        </div>

        {[
          ["Company", ["About", "Careers", "Newsroom"]],
          ["Solutions", ["AI & Data", "Cloud", "Software"]],
          ["Connect", ["Contact", "LinkedIn", "X / Twitter"]],
        ].map(([title, items]) => (
          <div key={title as string}>
            <div className="text-sm font-semibold">{title as string}</div>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              {(items as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ENOSX Technologies. All rights reserved.
      </div>
    </footer>
  );
}

export function Chapter({
  img,
  eyebrow,
  title,
  body,
  align = "left",
}: {
  img: string;
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "right";
}) {
  return (
    <section className="relative flex min-h-[75svh] items-end overflow-hidden sm:min-h-[85svh]">
      <img
        src={img}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="scrim-bottom absolute inset-0" />

      <div
        className={`relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24 ${
          align === "right" ? "flex justify-end" : ""
        }`}
      >
        <Reveal className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </div>

          <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] sm:text-5xl md:text-7xl">
            {title}
          </h2>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
