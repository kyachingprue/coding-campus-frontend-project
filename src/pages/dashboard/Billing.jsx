import { useSelector } from "react-redux";
import { FiDownload } from "react-icons/fi";
import PricingCard from "../../components/PricingCard";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { pricingPlans } from "../../lib/data";

const invoices = [
  { id: "INV-2201", date: "Aug 1, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-2154", date: "Jul 1, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-2098", date: "Jun 1, 2026", amount: "$19.00", status: "Paid" },
];

export default function Billing() {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fog">Billing</h1>
        <p className="mt-1 text-sm text-mist">Manage your plan and view past invoices.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-mist">Current plan</p>
            <p className="mt-1 font-display text-xl font-semibold text-fog">{user?.plan || "Starter"}</p>
          </div>
          <Button variant="outline" size="sm">Manage subscription</Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-5 font-display text-lg font-semibold text-fog">Available plans</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPlans.map((p) => (
            <PricingCard key={p.id} plan={p} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-5 font-display text-lg font-semibold text-fog">Invoice history</h2>
        <Card className="overflow-hidden p-0">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-mist">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3.5 font-mono text-fog">{inv.id}</td>
                    <td className="px-5 py-3.5 text-mist">{inv.date}</td>
                    <td className="px-5 py-3.5 text-fog">{inv.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 text-mist hover:text-fog">
                        <FiDownload size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
