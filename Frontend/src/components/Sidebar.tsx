import { Link, useLocation } from "react-router-dom";
import { ColorTokens } from "../colors/color";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
  { label: "Vendors", path: "/vendors", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zm-9 8c0-3.866 3.134-7 7-7h4c3.866 0 7 3.134 7 7" },
  { label: "RFQ's", path: "/rfqs", icon: "M4 7h16M4 12h16M4 17h16" },
  { label: "Quotations", path: "/quotations", icon: "M9 12h6M9 16h6M12 4v16" },
  { label: "Approvals", path: "/approvals", icon: "M5 13l4 4L19 7" },
  { label: "Purchase orders", path: "/purchase-orders", icon: "M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
  { label: "Invoices", path: "/invoices", icon: "M9 8h6M9 12h6M9 16h4M7 4h10l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" },
  { label: "Reports", path: "/reports", icon: "M6 18V6m6 12V10m6 8V13" },
  { label: "Activity", path: "/activity", icon: "M12 8v8m4-4H8" },
];

function Icon({ d, color }: { d: string; color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({ t }: { t: ColorTokens }) {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <nav className="mb-5 md:mb-0 md:sticky md:top-6 md:self-start">
      <div className="hidden md:block rounded-3xl border p-4" style={{ background: t.bgCard, borderColor: t.borderDefault }}>
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: t.textLabel }}>
            VendorBridge
          </div>
          <div className="mt-4 text-sm font-bold" style={{ color: t.textPrimary }}>
            Procurement ERP
          </div>
        </div>
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.path === activePath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition"
                style={{
                  background: isActive ? t.accentSubtle : t.bgCard,
                  color: isActive ? t.accent : t.textMuted,
                  border: `1px solid ${isActive ? t.accent : "transparent"}`,
                }}
              >
                <Icon d={item.icon} color={isActive ? t.accent : t.textMuted} />
                <span className="text-sm font-medium" style={{ color: isActive ? t.textPrimary : t.textMuted }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="md:hidden sticky top-0 z-30 w-full rounded-b-3xl border border-t-0 bg-opacity-100 p-3 shadow-xl"
        style={{ background: t.bgCard, borderColor: t.borderDefault }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: t.textLabel }}>
            Menu
          </div>
          <div className="text-xs font-semibold" style={{ color: t.textPrimary }}>
            Dashboard
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const isActive = item.path === activePath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-shrink-0 rounded-2xl border px-3 py-2 text-xs font-semibold transition whitespace-nowrap"
                style={{
                  background: isActive ? t.accent : t.bgSurface,
                  color: isActive ? t.textOnAccent : t.textMuted,
                  borderColor: isActive ? t.accent : t.borderSubtle,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
