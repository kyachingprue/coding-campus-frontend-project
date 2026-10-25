import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  FiArrowDown,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiInfo,
  FiLifeBuoy,
  FiSearch,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { Card, CardContent } from "../../components/ui/card";
import { apiRequest } from "../../lib/api";
import type { IconType } from "react-icons";
import type { PaymentRecord } from "../../lib/types";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
}

function downloadInvoice(invoice: Invoice) {
  const rows = [
    ["Invoice", "Date", "Description", "Amount", "Status"],
    [invoice.id, invoice.date, invoice.description, `$${invoice.amount.toFixed(2)}`, invoice.status],
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function SummaryCard({ icon: Icon, label, value, detail, accent = "cyan" }: {
  icon: IconType;
  label: string;
  value: string | number;
  detail: string;
  accent?: "cyan" | "violet";
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-mist">{label}</p>
          <p className="mt-2 truncate font-display text-2xl font-semibold text-fog">{value}</p>
          <p className="mt-1 text-xs text-mist">{detail}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent === "violet" ? "bg-violet/10 text-violet" : "bg-cyan/10 text-cyan"}`}>
          <Icon size={19} />
        </span>
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const user = useAppSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadError, setLoadError] = useState("");
  const plan = user?.plan || "Starter";
  const totalSpent = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);

  useEffect(() => {
    let active = true;
    apiRequest<{ payments: PaymentRecord[] }>("/payments/mine")
      .then(({ payments }) => {
        if (!active) return;
        setInvoices(payments.map((payment) => ({
          id: payment.stripeCheckoutSessionId,
          date: new Date(payment.paidAt || payment.createdAt).toLocaleDateString(),
          amount: payment.amount,
          status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          description: `${payment.course?.name || "Course"} · Course payment`,
        })));
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      });
    return () => { active = false; };
  }, []);

  const visibleInvoices = useMemo(() => invoices.filter((invoice) => {
    const matchesQuery = `${invoice.id} ${invoice.description} ${invoice.date}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesQuery && (filter === "all" || invoice.status.toLowerCase() === filter);
  }), [invoices, query, filter]);

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Account center</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fog">Billing & plans</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">Review your course payments and keep track of your billing history.</p>
        </div>
        <Link to="/contact" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-mist transition hover:text-cyan">
          <FiLifeBuoy size={16} /> Billing support <FiArrowRight size={14} />
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Billing summary">
        <SummaryCard icon={FiZap} label="Current plan" value={plan} detail="Your account membership" />
        <SummaryCard icon={FiFileText} label="Payments" value={invoices.length} detail="Records in billing history" accent="violet" />
        <SummaryCard icon={FiCreditCard} label="Recorded total" value={`$${totalSpent.toFixed(2)}`} detail="Based on listed invoices" />
      </section>

      <Card className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
        <CardContent className="relative p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
                <FiShield size={22} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-mist">Your current membership</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan/20 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-cyan">
                    <FiCheck size={11} /> Current
                  </span>
                </div>
                <h2 className="mt-1 font-display text-2xl font-semibold text-fog">{plan} plan</h2>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-mist">
                  Your account is ready for course learning. Need help with a payment or enrollment?
                </p>
              </div>
            </div>
            <Link to="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-sm font-medium text-fog transition hover:border-cyan/40 hover:text-cyan sm:w-fit">
              Contact support <FiArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-line bg-surface/80 p-3 text-xs leading-relaxed text-mist">
            <FiInfo className="mt-0.5 shrink-0 text-cyan" size={15} />
            Payments are processed securely by Stripe. Payment records appear here after confirmation.
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-xl font-semibold text-fog">Invoice history</h2>
            <p className="mt-1 text-sm text-mist">Search, filter, and download a copy of a payment record.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative flex">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search invoices"
                aria-label="Search invoices"
                className="h-10 w-full rounded-lg border border-line bg-surface text-sm text-fog outline-none placeholder:text-mist text-center px-3 focus:border-cyan sm:w-52"
              />
            </label>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter invoices by status"
              className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-fog outline-none focus:border-cyan"
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <Card className="overflow-hidden">
          {visibleInvoices.length ? (
            <>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-surface-2/60">
                    <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mist">
                      <th className="px-5 py-3.5 font-medium">Invoice</th>
                      <th className="px-5 py-3.5 font-medium">Date</th>
                      <th className="px-5 py-3.5 font-medium">Description</th>
                      <th className="px-5 py-3.5 font-medium">Amount</th>
                      <th className="px-5 py-3.5 font-medium">Status</th>
                      <th className="px-5 py-3.5 text-right font-medium">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-line last:border-0 hover:bg-surface-2/30">
                        <td className="px-5 py-4 font-mono text-xs text-fog">{invoice.id}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-mist">{invoice.date}</td>
                        <td className="px-5 py-4 text-mist">{invoice.description}</td>
                        <td className="px-5 py-4 font-medium text-fog">${invoice.amount.toFixed(2)}</td>
                        <td className="px-5 py-4"><span className="rounded-full border border-cyan/25 bg-cyan/10 px-2.5 py-1 text-[11px] font-medium text-cyan">{invoice.status}</span></td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => downloadInvoice(invoice)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-mist transition hover:bg-surface-2 hover:text-cyan" aria-label={`Download ${invoice.id} as CSV`}>
                            <FiDownload size={14} /> CSV
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-line sm:hidden">
                {visibleInvoices.map((invoice) => (
                  <article key={invoice.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-cyan">{invoice.id}</p>
                        <p className="mt-1 truncate text-sm font-medium text-fog">{invoice.description}</p>
                        <p className="mt-1 text-xs text-mist">{invoice.date}</p>
                      </div>
                      <span className="rounded-full border border-cyan/25 bg-cyan/10 px-2 py-1 text-[10px] font-medium text-cyan">{invoice.status}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-lg font-semibold text-fog">${invoice.amount.toFixed(2)}</span>
                      <button onClick={() => downloadInvoice(invoice)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-mist hover:border-cyan/40 hover:text-cyan" aria-label={`Download ${invoice.id} as CSV`}>
                        <FiArrowDown size={14} /> Download CSV
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="px-5 py-12 text-center">
              <FiSearch className="mx-auto text-mist" size={22} />
              <p className="mt-3 text-sm font-medium text-fog">No invoices found</p>
              <p className="mt-1 text-xs text-mist">Try another search term.</p>
            </div>
          )}
        </Card>
        {loadError && <p role="alert" className="mt-3 text-sm text-coral">{loadError}</p>}
        <p className="mt-3 text-[11px] leading-relaxed text-mist">Payment records are loaded from your account. Downloads are CSV copies of the displayed records.</p>
      </section>
    </div>
  );
}
