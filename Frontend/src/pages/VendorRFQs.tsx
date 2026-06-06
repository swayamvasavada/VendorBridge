import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileText, Package, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { tokens, Theme } from "../colors/color";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";
import { useRFQStore } from "../store/rfqStore";

const formatDate = (date: string) => {
  if (!date) return "No deadline";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const statusLabel = (status: string) =>
  status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function VendorRFQs() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );
  const user = useAuthStore((state) => state.user);
  const vendorRFQs = useRFQStore((state) => state.vendorRFQs);
  const loading = useRFQStore((state) => state.vendorRFQsLoading);
  const fetchVendorRFQs = useRFQStore((state) => state.fetchVendorRFQs);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchVendorRFQs().catch((error) => {
      toast.error(
        error?.response?.data?.message || "Unable to load your RFQs.",
        { id: "vendor-rfqs-error" },
      );
    });
  }, [fetchVendorRFQs]);

  const t = tokens(theme);
  const role = useMemo<RoleKey>(() => {
    switch (user?.role?.toUpperCase()) {
      case "VENDOR":
        return "vendor";
      case "PROCUREMENT_OFFICER":
        return "procurement_officer";
      case "MANAGER":
      case "APPROVER":
        return "manager";
      default:
        return "admin";
    }
  }, [user]);

  const dashboard = dashboardConfigs[role] ?? dashboardConfigs.vendor;

  return (
    <div
      className="min-h-screen"
      style={{
        background: t.bgPage,
        color: t.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Sidebar t={t} navItems={dashboard.sidebarItems} />

          <main className="min-w-0 space-y-6">
            <section
              className="rounded-[28px] border p-6"
              style={{ background: t.bgSurface, borderColor: t.borderDefault }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.25em]"
                    style={{ color: t.textLabel }}
                  >
                    VendorBridge • {dashboard.roleLabel}
                  </p>
                  <h1 className="mt-3 text-3xl font-black">My RFQs</h1>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.textMuted }}>
                    RFQs assigned to your vendor account from the backend.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fetchVendorRFQs()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: t.bgCard,
                      borderColor: t.borderDefault,
                      color: t.textPrimary,
                    }}
                  >
                    <RefreshCcw size={16} />
                    {loading ? "Loading" : "Refresh"}
                  </button>
                  <button
                    onClick={() =>
                      setTheme((current) => (current === "dark" ? "light" : "dark"))
                    }
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                    style={{
                      background: t.bgCard,
                      borderColor: t.borderDefault,
                      color: t.textPrimary,
                    }}
                  >
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </button>
                </div>
              </div>
            </section>

            <section
              className="rounded-[28px] border p-6"
              style={{ background: t.bgSurface, borderColor: t.borderDefault }}
            >
              {loading ? (
                <div className="py-16 text-center text-sm" style={{ color: t.textMuted }}>
                  Loading assigned RFQs...
                </div>
              ) : vendorRFQs.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText className="mx-auto" size={38} color={t.textMuted} />
                  <h2 className="mt-4 text-xl font-bold">No RFQs assigned</h2>
                  <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                    New backend RFQ assignments will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {vendorRFQs.map((rfq) => (
                    <article
                      key={rfq.rfqID}
                      className="rounded-2xl border p-5"
                      style={{ background: t.bgCard, borderColor: t.borderDefault }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: t.textLabel }}>
                            RFQ #{rfq.rfqID || "New"}
                          </p>
                          <h2 className="mt-2 truncate text-xl font-black">{rfq.title}</h2>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                          style={{ background: t.accentSubtle, color: t.accent }}
                        >
                          {statusLabel(String(rfq.status))}
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-6" style={{ color: t.textMuted }}>
                        {rfq.description || "No description provided."}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: t.borderSubtle }}>
                          <CalendarDays size={17} color={t.accent} />
                          <div>
                            <p className="text-xs" style={{ color: t.textMuted }}>Deadline</p>
                            <p className="text-sm font-bold">{formatDate(rfq.deadline)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: t.borderSubtle }}>
                          <Package size={17} color={t.accent} />
                          <div>
                            <p className="text-xs" style={{ color: t.textMuted }}>Items</p>
                            <p className="text-sm font-bold">{rfq.items.length}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
