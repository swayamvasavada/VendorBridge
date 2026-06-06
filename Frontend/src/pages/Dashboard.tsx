import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { tokens, ColorTokens, Theme } from "../colors/color";
import Sidebar from "../components/Sidebar";

const stats = [
  { label: "Active RFQ", value: "12", hint: "Open requests" },
  { label: "Approvals", value: "5", hint: "Awaiting decision" },
  { label: "PO's this month", value: "$2.3M", hint: "Approved value" },
  { label: "Overdue invoices", value: "3", hint: "Needs attention" },
];

const recentOrders = [
  { po: "PO-1", vendor: "Infra", amount: "$87,000", status: "Approved" },
  { po: "PO-2", vendor: "Tech core", amount: "$140,000", status: "Pending" },
  { po: "PO-3", vendor: "OfficeNeed Co", amount: "$34,900", status: "Draft" },
];

const topActions = [
  { label: "+ New RFQ", key: "rfq" },
  { label: "Add Vendor", key: "vendor" },
  { label: "View Invoices", key: "invoice" },
];

function statusBadge(status: string, t: ColorTokens) {
  const lower = status.toLowerCase();
  const bg =
    lower === "approved"
      ? t.accentSubtle
      : lower === "pending"
      ? t.warning
      : lower === "draft"
      ? t.borderSubtle
      : t.borderSubtle;
  const color =
    lower === "approved"
      ? t.accent
      : lower === "pending"
      ? t.warning
      : t.textMuted;

  return (
    <span
      className="rounded-full px-3 py-1 text-[0.72rem] font-semibold"
      style={{ background: bg, color }}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const theme: Theme = "dark";
  const t = tokens(theme);
  const location = useLocation();
  const section = useMemo(() => {
    const path = location.pathname.replace("/", "") || "dashboard";
    return path === "dashboard" ? "Dashboard" : path.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50" style={{ background: t.bgPage, color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1600px] mx-auto px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar t={t} />

          <main className="space-y-6 min-w-0 w-full">
            <header className="rounded-3xl border p-6" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.25em] font-semibold" style={{ color: t.textLabel }}>
                    VendorBridge
                  </div>
                  <h1 className="mt-3 text-2xl font-black" style={{ color: t.textPrimary }}>
                    {section}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: t.textMuted }}>
                    Welcome back, Procurement Officer — today's overview of procurement activity, approvals, and invoices.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => undefined}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold transition"
                    style={{
                      background: t.bgCard,
                      color: t.textPrimary,
                      border: `1px solid ${t.borderDefault}`,
                    }}
                  >
                    Export
                  </button>
                  <button
                    onClick={() => undefined}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold transition"
                    style={{ background: t.accent, color: t.textOnAccent }}
                  >
                    Add new report
                  </button>
                </div>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border p-5 transition"
                  style={{ background: t.bgSurface, borderColor: t.borderDefault }}
                >
                  <p className="text-xs uppercase tracking-[0.24em] font-semibold" style={{ color: t.textLabel }}>
                    {item.label}
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-black" style={{ color: t.textPrimary }}>
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                        {item.hint}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: t.accentSubtle }}>
                      <div className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border p-6" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                      Recent Purchase Orders
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                      Review the latest procurement activity and keep track of vendor orders.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topActions.map((action) => (
                      <button
                        key={action.key}
                        className="rounded-2xl px-4 py-2 text-sm font-semibold transition"
                        style={{
                          background: t.bgCard,
                          color: t.textPrimary,
                          border: `1px solid ${t.borderDefault}`,
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                    <thead>
                      <tr className="text-sm uppercase tracking-[0.2em] text-left" style={{ color: t.textLabel }}>
                        <th className="pb-4 pr-6">PO#</th>
                        <th className="pb-4 pr-6">Vendor</th>
                        <th className="pb-4 pr-6">Amount</th>
                        <th className="pb-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.po} className="border-t" style={{ borderColor: t.borderSubtle }}>
                          <td className="py-4 pr-6 font-semibold" style={{ color: t.textPrimary }}>{order.po}</td>
                          <td className="py-4 pr-6" style={{ color: t.textSecondary }}>{order.vendor}</td>
                          <td className="py-4 pr-6 font-semibold" style={{ color: t.textPrimary }}>{order.amount}</td>
                          <td className="py-4 pr-6">{statusBadge(order.status, t)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border p-6" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: t.textLabel }}>
                        Activity summary
                      </p>
                      <h3 className="mt-2 text-xl font-bold" style={{ color: t.textPrimary }}>
                        Procurement pulse
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-teal-100 px-3 py-2 text-teal-700" style={{ background: t.accentSubtle, color: t.accent }}>
                      4.8%
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border p-4" style={{ borderColor: t.borderDefault }}>
                      <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>Pending vendor approvals</p>
                      <p className="mt-2 text-sm" style={{ color: t.textMuted }}>3 new approvals waiting approval in the last 24 hours.</p>
                    </div>
                    <div className="rounded-3xl border p-4" style={{ borderColor: t.borderDefault }}>
                      <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>Payment outlook</p>
                      <p className="mt-2 text-sm" style={{ color: t.textMuted }}>42 invoices are scheduled for payment by month-end.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border p-6" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: t.textLabel }}>
                        Insights
                      </p>
                      <h3 className="mt-2 text-xl font-bold" style={{ color: t.textPrimary }}>
                        Spend overview
                      </h3>
                    </div>
                  </div>
                  <div className="mt-6 h-40 rounded-3xl bg-gradient-to-br from-teal-100 to-teal-50 p-4" style={{ color: t.textPrimary }}>
                    <div className="h-full rounded-3xl bg-white/60 p-4 text-sm text-slate-600" style={{ color: t.textSecondary }}>
                      Chart placeholder
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
