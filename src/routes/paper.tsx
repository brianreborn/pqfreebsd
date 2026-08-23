import { createFileRoute } from "@tanstack/react-router";
import {
  ABSTRACT,
  BACKGROUND,
  CONCLUSION,
  IMPLEMENTATION,
  INTRODUCTION,
  LEMMAS,
  MOTTO,
  PRAXIS,
  RELATED,
  STATUS,
  THESES,
  THREAT,
} from "@/lib/pq/paper";
import {
  TRUSTEDBSD_AUDIT,
  TRUSTEDBSD_BLURB,
  TRUSTEDBSD_DOCS,
  TRUSTEDBSD_HANDBOOK,
  TRUSTEDBSD_HOME,
  TRUSTEDBSD_MAC,
  TRUSTEDBSD_PAPERS,
  TRUSTEDBSD_SEBSD,
} from "@/lib/pq/trustedbsd";

export const Route = createFileRoute("/paper")({ component: Paper });

function kindLabel(kind: (typeof THESES)[number]["kind"]) {
  if (kind === "inherited") return "pqac";
  if (kind === "held") return "held";
  return "this skill";
}

function Paper() {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="rounded-xl bg-paper px-6 py-10 text-ink md:px-12 md:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">
          pqac(7) basis · pqfreebsd(7) · 22 August 2026
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em]">pqfreebsd</h1>
        <p className="mt-2 text-lg italic text-subtle">{MOTTO}</p>
        <Section title="Abstract">{ABSTRACT}</Section>
        <Section title="1. Introduction">{INTRODUCTION}</Section>
        <Section title="2. Background">{BACKGROUND}</Section>
        <h2 className="mt-10 text-xl font-medium">TrustedBSD papers (not in base)</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{TRUSTEDBSD_BLURB}</p>
        <p className="mt-3 text-sm">
          <a className="underline" href={TRUSTEDBSD_HOME}>
            trustedbsd.org
          </a>
          {" · "}
          <a className="underline" href={TRUSTEDBSD_DOCS}>
            docs.html
          </a>
          {" · "}
          <a className="underline" href={TRUSTEDBSD_MAC}>
            MAC Framework
          </a>
          {" · "}
          <a className="underline" href={TRUSTEDBSD_SEBSD}>
            SEBSD
          </a>
          {" · "}
          <a className="underline" href={TRUSTEDBSD_AUDIT}>
            audit / OpenBSM
          </a>
        </p>
        <ul className="mt-4 grid gap-3 text-[0.95rem] leading-relaxed">
          {TRUSTEDBSD_PAPERS.map((p) => (
            <li key={p.id}>
              <a className="font-medium underline" href={p.url}>
                {p.title}
              </a>
              <span className="mt-1 block text-sm text-subtle">
                {p.authors}. {p.venue}, {p.year}. {p.why}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-subtle">Handbook:</p>
        <ul className="mt-2 grid gap-1 text-sm">
          {TRUSTEDBSD_HANDBOOK.map((h) => (
            <li key={h.url}>
              <a className="underline" href={h.url}>
                {h.title}
              </a>
            </li>
          ))}
        </ul>
        <Section title="3. Threat model">{THREAT}</Section>
        <Section title="4. Two lemmas">{LEMMAS}</Section>
        <h2 className="mt-10 text-xl font-medium">5. Theses</h2>
        <ol className="mt-4 grid gap-5">
          {THESES.map((t) => (
            <li key={t.id}>
              <p className="text-xs uppercase tracking-[0.16em] text-subtle">
                {t.id} · {kindLabel(t.kind)}
              </p>
              <p className="mt-1 font-medium">{t.title}</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed">{t.body}</p>
            </li>
          ))}
        </ol>
        <Section title="6. Implementation">{IMPLEMENTATION}</Section>
        <Section title="7. Status">{STATUS}</Section>
        <Section title="8. Related work">{RELATED}</Section>
        <h2 className="mt-10 text-xl font-medium">Operational notes</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed">
          Residue from packaging A_M on GENERIC. Deniable separately. Walk before oneenforce.
        </p>
        <ol className="mt-4 grid gap-4">
          {PRAXIS.map((p) => (
            <li key={p.id}>
              <p className="font-medium">{p.title}</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-subtle">{p.body}</p>
            </li>
          ))}
        </ol>
        <Section title="9. Conclusion">{CONCLUSION}</Section>
        <p className="mt-12 text-sm text-subtle">
          Light-ware License. Copyright © 2026 Brian Fundakowski Feldman. This product includes
          software developed by Brian Fundakowski Feldman. pqac(7) is the basis. Papers:{" "}
          http://www.trustedbsd.org/docs.html
        </p>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-medium">{title}</h2>
      {children.split("\n\n").map((p) => (
        <p key={p.slice(0, 48)} className="mt-3 text-[0.95rem] leading-relaxed">
          {p}
        </p>
      ))}
    </section>
  );
}
