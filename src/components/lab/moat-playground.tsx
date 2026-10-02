"use client";

import { useMemo, useRef, useState } from "react";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

/**
 * A small, faithful slice of Moat's threat rules (from its README):
 * a baseline STRIDE set per element type, plus context rules that add a
 * category or raise its severity.
 */
type Kind = "entity" | "process" | "store" | "flow";
type Cat = "S" | "T" | "R" | "I" | "D" | "E";
type Severity = "medium" | "high" | "critical";

const CATS: { id: Cat; name: string }[] = [
  { id: "S", name: "Spoofing" },
  { id: "T", name: "Tampering" },
  { id: "R", name: "Repudiation" },
  { id: "I", name: "Information disclosure" },
  { id: "D", name: "Denial of service" },
  { id: "E", name: "Elevation of privilege" },
];

const KINDS: { id: Kind; label: string }[] = [
  { id: "process", label: "Process" },
  { id: "store", label: "Data store" },
  { id: "flow", label: "Data flow" },
  { id: "entity", label: "External entity" },
];

const TOGGLES: Record<Kind, { key: string; label: string }[]> = {
  entity: [],
  process: [
    { key: "internet_facing", label: "Internet facing" },
    { key: "authn", label: "Requires authentication" },
    { key: "authz", label: "Checks authorisation" },
    { key: "handles_secrets", label: "Handles secrets" },
    { key: "logging", label: "Writes to a log store" },
  ],
  store: [
    { key: "pii", label: "Holds personal data" },
    { key: "encrypted_at_rest", label: "Encrypted at rest" },
    { key: "backups", label: "Backed up" },
    { key: "stores_logs", label: "Stores logs" },
  ],
  flow: [
    { key: "crossing", label: "Crosses a trust boundary" },
    { key: "encrypted", label: "Encrypted in transit" },
    { key: "carries_pii", label: "Carries personal data" },
    { key: "authenticated", label: "Authenticated" },
    { key: "internal", label: "Lands inside the network" },
  ],
};

const DEFAULTS: Record<string, boolean> = {
  internet_facing: true,
  authn: true,
  authz: true,
  handles_secrets: false,
  logging: true,
  pii: false,
  encrypted_at_rest: true,
  backups: true,
  stores_logs: false,
  crossing: true,
  encrypted: true,
  carries_pii: false,
  authenticated: true,
  internal: true,
};

const BASELINE: Record<Kind, Cat[]> = {
  entity: ["S", "R"],
  process: ["S", "T", "R", "I", "D", "E"],
  store: ["T", "I", "D"],
  flow: ["T", "I", "D"],
};

const RANK: Record<Severity, number> = { medium: 1, high: 2, critical: 3 };

function evaluate(kind: Kind, on: Record<string, boolean>) {
  const cats = new Set<Cat>(BASELINE[kind]);
  const sev = new Map<Cat, Severity>();
  const fired: string[] = [];
  const raise = (c: Cat, s: Severity) => {
    cats.add(c);
    if (!sev.has(c) || RANK[s] > RANK[sev.get(c)!]) sev.set(c, s);
  };

  if (kind === "store" && on.stores_logs) cats.add("R");

  if (kind === "process") {
    if (on.internet_facing && !on.authn) {
      fired.push("unauth-internet-process");
      raise("S", "critical");
      raise("E", "high");
    }
    if (!on.authz) {
      fired.push("no-authz");
      raise("E", "high");
    }
    if (on.handles_secrets) {
      fired.push("secrets-process");
      raise("I", "high");
    }
    if (!on.logging) {
      fired.push("no-logging");
      raise("R", "medium");
    }
  }
  if (kind === "store") {
    if (on.pii) {
      fired.push("pii-store");
      raise("I", "critical");
      raise("T", "high");
    }
    if (!on.encrypted_at_rest) {
      fired.push("unencrypted-store");
      raise("I", "high");
    }
    if (!on.backups) {
      fired.push("no-backups");
      raise("D", "high");
    }
  }
  if (kind === "flow") {
    if (on.crossing && !on.encrypted) {
      fired.push("plaintext-crossing");
      raise("I", "critical");
      raise("T", "high");
    }
    if (on.carries_pii && !on.encrypted) {
      fired.push("pii-in-transit");
      raise("I", "critical");
    }
    if (!on.authenticated && on.internal) {
      fired.push("unauth-flow");
      raise("S", "high");
    }
  }
  return { cats, sev, fired };
}

const SEV_STYLE: Record<Severity, string> = {
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-700",
};

export function MoatPlayground() {
  const root = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<Kind>("process");
  const [on, setOn] = useState<Record<string, boolean>>(DEFAULTS);
  const { cats, sev, fired } = useMemo(() => evaluate(kind, on), [kind, on]);

  // A small bump on every tile whenever the result changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-tile]", { scale: 0.96 }, { scale: 1, duration: 0.5, ease: ease.out, stagger: 0.03 });
    },
    { scope: root, dependencies: [kind, on] },
  );

  return (
    <div ref={root} className="rounded-[18px] bg-white p-4 md:p-5">
      <div role="group" aria-label="Element type" className="flex flex-wrap gap-1 rounded-full bg-soft p-1">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            aria-pressed={kind === k.id}
            onClick={() => setKind(k.id)}
            className="rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors aria-pressed:bg-white aria-pressed:text-fg aria-pressed:shadow-sm"
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-1.5">
        {TOGGLES[kind].length === 0 && (
          <p className="py-2 text-[14px] text-muted">External entities always get spoofing and repudiation, nothing more.</p>
        )}
        {TOGGLES[kind].map((t) => (
          <label key={t.key} htmlFor={`moat-${t.key}`} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-2 py-1.5 text-[14px] hover:bg-soft">
            {t.label}
            <span className="relative inline-flex">
              <input
                id={`moat-${t.key}`}
                type="checkbox"
                checked={on[t.key]}
                onChange={(e) => setOn((s) => ({ ...s, [t.key]: e.target.checked }))}
                className="peer sr-only"
              />
              <span className="h-5 w-9 rounded-full bg-soft-2 transition-colors peer-checked:bg-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg" />
              <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-300 ease-[var(--ease-out-expo)] peer-checked:translate-x-4" />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3" aria-live="polite">
        {CATS.map((c) => {
          const active = cats.has(c.id);
          const s = sev.get(c.id);
          return (
            <div
              key={c.id}
              data-tile=""
              className={`rounded-xl border p-2.5 transition-colors duration-300 ${active ? "border-line bg-white" : "border-transparent bg-soft opacity-40"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px]">{c.id}</span>
                {active && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${s ? SEV_STYLE[s] : "bg-soft text-muted"}`}>
                    {s ?? "baseline"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12px] leading-tight text-muted">{c.name}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 min-h-5 font-mono text-[11.5px] text-muted">
        {fired.length ? `rules fired: ${fired.join(", ")}` : "no context rules fired"}
      </p>
    </div>
  );
}
