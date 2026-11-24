"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { languageEvent } from "@/lib/language";

export type Status = "idle" | "sending" | "sent" | "failed";

/** State, errors and sending, shared by both forms. */
export function useEnquiry(initial: Record<string, string>, firstStep = 0) {
  const locale = useLocale();
  const [values, setValues] = useState(initial);
  const [errors, setErrorMap] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(firstStep);
  const latest = useRef({ values, step });
  const restored = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrorMap((e) => {
      if (!e[name]) return e;
      const rest = { ...e };
      delete rest[name];
      return rest;
    });
  };

  /** Shows errors after a submit. Each call moves focus to the first one. */
  const setErrors = (map: Record<string, string>) => {
    setErrorMap(map);
    if (Object.keys(map).length) setAttempt((n) => n + 1);
  };

  // Runs once per failed submit, so fixing a field never moves the cursor.
  useEffect(() => {
    if (attempt) form.current?.querySelector<HTMLElement>("[aria-invalid], [data-invalid] input")?.focus();
  }, [attempt]);

  useEffect(() => {
    latest.current = { values, step };
  }, [values, step]);

  // Changing language reloads the page. Answers are kept in this tab just long
  // enough to put them back, and only when the visitor changes language.
  useEffect(() => {
    const key = `enquiry:${location.pathname}`;
    const save = () => {
      try {
        if (Object.keys(latest.current.values).length) sessionStorage.setItem(key, JSON.stringify(latest.current));
      } catch {}
    };
    let id = 0;
    try {
      const kept = sessionStorage.getItem(key);
      if (kept) {
        const { values: v, step: n } = JSON.parse(kept);
        id = requestAnimationFrame(() => {
          sessionStorage.removeItem(key);
          restored.current = true;
          setValues(v);
          setStep(n);
        });
      }
    } catch {}
    addEventListener(languageEvent, save);
    return () => {
      cancelAnimationFrame(id);
      removeEventListener(languageEvent, save);
    };
  }, []);

  // Move focus to the outcome.
  useEffect(() => {
    if (status === "sent" || status === "failed") result.current?.focus();
  }, [status]);

  async function send(payload: object) {
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: values.website ?? "", page: location.href, locale }),
      });
      if (res.status === 400) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
          setStatus("idle");
          return;
        }
      }
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  const reset = () => {
    setValues(initial);
    setErrors({});
    setStatus("idle");
    setStep(firstStep);
  };

  return { values, set, step, setStep, restored, errors, setErrors, status, send, reset, form, result };
}
