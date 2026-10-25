import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import { Input, Label } from "../components/ui/input";
import { Button } from "../components/ui/button";

const contactMethods = [
  {
    icon: FiMail,
    label: "Email",
    value: "info@codecampus.com",
    href: "mailto:info@codecampus.com",
  },
  {
    icon: FiPhone,
    label: "Call us",
    value: "+1 (555) 019-2038",
    href: "tel:+15550192038",
  },
  {
    icon: FiMapPin,
    label: "Our office",
    value: "San Francisco, CA",
  },
];

const topics = ["Courses", "Billing & account", "Team training", "Something else"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  function resetForm() {
    setSent(false);
    setForm({ name: "", email: "", topic: "", message: "" });
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-128 bg-[radial-gradient(ellipse_at_top,rgba(0,217,192,0.10),transparent_65%)]"
      />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16"
        >
          <section className="lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              Contact our team
            </span>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-fog sm:text-5xl lg:text-6xl">
              Big idea?
              <br />
              <span className="text-cyan">Let’s build</span> on it.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist sm:text-lg">
              Whether you’re choosing your first course or planning training for your whole team,
              we’re here to help you find the right next step.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-line bg-surface/70 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                <FiClock size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fog">A real person, not a bot</p>
                <p className="mt-0.5 text-xs leading-relaxed text-mist">
                  Our team usually replies within one business day.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contactMethods.map((method) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-cyan transition-colors group-hover:bg-cyan/10">
                      <method.icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-mist">{method.label}</span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-fog">
                        {method.value}
                      </span>
                    </span>
                    {method.href && (
                      <FiArrowUpRight
                        aria-hidden="true"
                        className="shrink-0 text-mist transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                        size={16}
                      />
                    )}
                  </>
                );

                return method.href ? (
                  <a
                    key={method.label}
                    href={method.href}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface/60 p-4 transition-colors hover:border-cyan/40 hover:bg-surface"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={method.label}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface/60 p-4"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label="Send us a message">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-cyan/25 bg-surface/80 px-6 py-12 text-center shadow-xl shadow-cyan/5 sm:px-10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
                  <FiCheck size={26} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-fog">
                  Message sent!
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
                  Thanks, {form.name.split(" ")[0] || "there"}. We’ll get back to you at{" "}
                  <span className="font-medium text-fog">{form.email}</span> within one business
                  day.
                </p>
                <Button variant="outline" size="sm" className="mt-7" onClick={resetForm}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-line bg-surface/80 p-5 shadow-xl shadow-black/5 sm:p-8 lg:p-9"
              >
                <div className="mb-7 border-b border-line pb-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cyan">
                    We’d love to hear from you
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog">
                    Send us a message
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    Tell us a little about what you need and we’ll point you in the right direction.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-name">Your name</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ada Lovelace"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email address</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ada@example.com"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <Label htmlFor="contact-topic">What can we help with?</Label>
                  <select
                    id="contact-topic"
                    name="topic"
                    required
                    value={form.topic}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-line bg-surface-2 px-4 text-sm text-fog outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
                  >
                    <option value="" disabled>
                      Choose a topic
                    </option>
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <Label htmlFor="contact-message">Your message</Label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Share a few details so we can help..."
                    className="flex min-h-36 w-full resize-y rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm leading-relaxed text-fog placeholder:text-mist/70 outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-mist">
                    We’ll only use your details to reply to your message.
                  </p>
                  <Button type="submit" className="w-full sm:w-auto">
                    Send message <FiSend size={15} />
                  </Button>
                </div>
              </form>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  );
}
