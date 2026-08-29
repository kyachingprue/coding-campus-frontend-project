import { useState } from "react";
import { motion } from "motion/react";
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheck } from "react-icons/fi";
import { Input, Label } from "../components/ui/input";
import { Button } from "../components/ui/button";

const info = [
  { icon: FiMail, label: "Email", value: "hello@codeforge.dev" },
  { icon: FiPhone, label: "Phone", value: "+1 (555) 019-2038" },
  { icon: FiMapPin, label: "Office", value: "San Francisco, CA" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan">Contact</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
          Let's talk
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mist">
          Questions about courses, billing, or bringing CodeForge to your team? Send a message.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {info.map((i) => (
              <div key={i.label} className="flex items-start gap-4 rounded-xl border border-line bg-surface/50 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <i.icon size={18} />
                </span>
                <div>
                  <p className="text-xs text-mist">{i.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-fog">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/5 p-12 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                <FiCheck size={24} />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-fog">Message sent</h3>
              <p className="mt-2 text-sm text-mist">
                Thanks, {form.name.split(" ")[0] || "there"} — we'll reply to {form.email || "your inbox"} within one business day.
              </p>
              <Button variant="outline" size="sm" className="mt-6" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>
                Send another message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-surface/50 p-7 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Ada Lovelace" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="ada@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="flex w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-fog placeholder:text-mist/70 outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Send message <FiSend size={15} />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
