"use client";

import { useState } from "react";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const inputClass =
  "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none bg-[#eef3f1] dark:bg-slate-900 dark:text-white";

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.subject.trim().length < 3) errors.subject = "Please add a short subject.";
  if (values.message.trim().length < 10) errors.message = "Your message should be at least 10 characters.";
  return errors;
}

export default function ContactForm({ email: CONTACT_EMAIL }: { email: string }) {
  const [values, setValues] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

  function update(field: keyof Fields, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // There is no mail backend yet, so hand the message to the visitor's email app.
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      values.subject.trim(),
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const field = (name: keyof Fields) =>
    `${inputClass} ${
      errors[name] ? "border-rose-400 dark:border-rose-500" : "border-transparent dark:border-slate-700"
    }`;

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-primary/70 dark:text-slate-400" htmlFor="c-name">
            Full Name
          </label>
          <input
            className={field("name")}
            id="c-name"
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            type="text"
            value={values.name}
          />
          {errors.name ? <p className="text-xs text-rose-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-primary/70 dark:text-slate-400" htmlFor="c-email">
            Email Address
          </label>
          <input
            className={field("email")}
            id="c-email"
            onChange={(e) => update("email", e.target.value)}
            placeholder="email@example.com"
            type="email"
            value={values.email}
          />
          {errors.email ? <p className="text-xs text-rose-500">{errors.email}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-primary/70 dark:text-slate-400" htmlFor="c-subject">
          Subject
        </label>
        <input
          className={field("subject")}
          id="c-subject"
          onChange={(e) => update("subject", e.target.value)}
          placeholder="How can we help?"
          type="text"
          value={values.subject}
        />
        {errors.subject ? <p className="text-xs text-rose-500">{errors.subject}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-primary/70 dark:text-slate-400" htmlFor="c-message">
          Your Message
        </label>
        <textarea
          className={`${field("message")} resize-none`}
          id="c-message"
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us more about your inquiry..."
          rows={5}
          value={values.message}
        />
        {errors.message ? <p className="text-xs text-rose-500">{errors.message}</p> : null}
      </div>
      <button
        className="w-full bg-accent text-white py-3.5 rounded-full font-bold hover:brightness-105 active:scale-[0.98] transition-all"
        type="submit"
      >
        Send Message
      </button>
      {opened ? (
        <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm text-primary dark:text-slate-200" role="status">
          Your email app should open with the message ready to send. If it did not, write to us at{" "}
          <a className="font-bold text-accent underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
