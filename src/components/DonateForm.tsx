"use client";

import Link from "next/link";
import { useState } from "react";

const PRESETS = [25, 50, 100, 250];

type DonateFormProps = {
  /** External donation page. When set, supporters are sent there instead of using the form. */
  url: string;
  note: string;
  donateLabel: string;
  externalNotice: string;
};

export default function DonateForm({ url, note, donateLabel, externalNotice }: DonateFormProps) {
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [preset, setPreset] = useState<number | null>(25);
  const [custom, setCustom] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const amount = custom ? Number(custom) : (preset ?? 0);
  const validAmount = Number.isFinite(amount) && amount > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validAmount) {
      setError("Please choose or enter a donation amount.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (url) {
    return (
      <div className="flex flex-col gap-6">
        {note ? (
          <div className="whitespace-pre-line rounded-xl bg-slate-50 p-5 leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {note}
          </div>
        ) : null}
        <a
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent font-bold text-white transition-all hover:brightness-105"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined">favorite</span>
          {donateLabel}
        </a>
        <p className="text-center text-sm text-slate-500">{externalNotice}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center" role="status">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
          <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
        </div>
        <h2 className="text-2xl font-black text-primary dark:text-white">
          Thank you, {firstName.trim()}!
        </h2>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          Online card payments are not connected yet, so nothing has been charged. To complete your
          ${amount.toLocaleString("en-US")} {frequency} gift, please contact our team and we will
          guide you through the options.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className="h-12 px-6 inline-flex items-center rounded-xl bg-accent text-white font-bold hover:brightness-105"
            href="/contact"
          >
            Contact our team
          </Link>
          <button
            className="h-12 px-6 rounded-xl border border-neutral-soft dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => setSubmitted(false)}
            type="button"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "h-12 w-full border border-transparent rounded-xl px-3 bg-[#f3f6f5] focus:ring-accent focus:border-accent dark:bg-slate-800 dark:text-white";

  return (
    <form className="flex flex-col gap-8" noValidate onSubmit={handleSubmit}>
      <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-full self-start">
        {(["one-time", "monthly"] as const).map((option) => (
          <button
            key={option}
            aria-pressed={frequency === option}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
              frequency === option
                ? "bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white"
                : "text-slate-500 hover:text-primary dark:hover:text-white"
            }`}
            onClick={() => setFrequency(option)}
            type="button"
          >
            {option === "one-time" ? "One-time" : "Monthly"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Select Amount (USD)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESETS.map((value) => {
            const selected = !custom && preset === value;
            return (
              <button
                key={value}
                aria-pressed={selected}
                className={`h-12 rounded-full border font-bold transition-all ${
                  selected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => {
                  setPreset(value);
                  setCustom("");
                }}
                type="button"
              >
                ${value}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
          <input
            aria-label="Custom amount"
            className="w-full h-12 pl-8 border border-slate-200 dark:border-slate-700 rounded-full bg-[#f3f6f5] focus:ring-accent focus:border-accent dark:bg-slate-800 dark:text-white"
            min="1"
            onChange={(event) => {
              setCustom(event.target.value);
              setPreset(null);
            }}
            placeholder="Custom Amount"
            type="number"
            value={custom}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500" htmlFor="d-first">
            FIRST NAME
          </label>
          <input
            className={inputClass}
            id="d-first"
            onChange={(event) => setFirstName(event.target.value)}
            type="text"
            value={firstName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500" htmlFor="d-last">
            LAST NAME
          </label>
          <input
            className={inputClass}
            id="d-last"
            onChange={(event) => setLastName(event.target.value)}
            type="text"
            value={lastName}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-100 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          className="w-full h-14 bg-accent text-white rounded-full font-bold hover:brightness-105 transition-all active:scale-[0.98]"
          type="submit"
        >
          {validAmount
            ? `Donate $${amount.toLocaleString("en-US")}${frequency === "monthly" ? " / month" : ""}`
            : "Continue"}
        </button>
      </div>
    </form>
  );
}
