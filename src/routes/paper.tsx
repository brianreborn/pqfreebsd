import { createFileRoute } from "@tanstack/react-router";
import { ABSTRACT, DERIVATION, ESOTERIC, EXOTERIC, PRAXIS, THESES } from "@/lib/pq/paper";
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
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">pqac(7) basis · pqfreebsd(7) living paper · 22 August 2026</p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em]">pqfreebsd</h1>
        <p className="mt-2 text-lg italic text-subtle">
          post-quantum trusted FreeBSD — built on pqac(7), updated as morphisms land
        </p>
        <Section title="Abstract">{ABSTRACT}</Section>
        <Section title="Exoteric: naming and mediation">{EXOTERIC}</Section>
        <Section title="Esoteric: the observation function">{ESOTERIC}</Section>
        <Section title="Derivation">{DERIVATION}</Section>
        <h2 className="mt-10 text-xl font-medium">TrustedBSD</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{TRUSTEDBSD_BLURB}</p>
        <p className="mt-3 text-sm">
          <a className="underline" href={TRUSTEDBSD_HOME}>
            trustedbsd.org
          </a>
          {" · "}
          <a className="underline" href={TRUSTEDBSD_DOCS}>
            papers (not in base)
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
        <p className="mt-4 text-sm text-subtle">Handbook (also not a man page):</p>
        <ul className="mt-2 grid gap-1 text-sm">
          {TRUSTEDBSD_HANDBOOK.map((h) => (
            <li key={h.url}>
              <a className="underline" href={h.url}>
                {h.title}
              </a>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-xl font-medium">Theses</h2>
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
        <h2 className="mt-10 text-xl font-medium">Praxis</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed">
          Residue from packaging A_M on GENERIC, then from stating A_D and the ledger as packages
          rather than slogans. Deniable separately; walk before oneenforce.
        </p>
        <ol className="mt-4 grid gap-4">
          {PRAXIS.map((p) => (
            <li key={p.id}>
              <p className="font-medium">{p.title}</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-subtle">{p.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-sm text-subtle">
          Light-ware License. Copyright © 2026 Brian Fundakowski Feldman. This product includes
          software developed by Brian Fundakowski Feldman. pqac(7) is the basis. pqfreebsd(7) is
          updated as morphisms land. T1 and T2 are the parent packages, packaging the TrustedBSD
          MAC Framework. Papers: http://www.trustedbsd.org/docs.html
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
        <p key={p.slice(0, 40)} className="mt-3 text-[0.95rem] leading-relaxed">
          {p}
        </p>
      ))}
    </section>
  );
}
