import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  FileCheck2,
  Package,
  RefreshCcw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { tokens, Theme } from "../colors/color";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";
import { useRFQStore, VendorRFQ } from "../store/rfqStore";
import VendorRFQs from "./VendorRFQs";

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

function getRole(userRole?: string): RoleKey {
  switch (userRole?.toUpperCase()) {
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
}

function RFQApprovalCard({
  rfq,
  loading,
  onAccept,
  onDecline,
  t,
}: {
  rfq: VendorRFQ;
  loading: boolean;
  onAccept: (rfqID: number) => void;
  onDecline: (rfqID: number) => void;
  t: ReturnType<typeof tokens>;
}) {
  return (
    <article
      className="rounded-2xl border p-5"
      style={{ background: t.bgCard, borderColor: t.borderDefault }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: t.textLabel }}
          >
            RFQ #{rfq.rfqID || "New"}
          </p>
          <h2 className="mt-2 text-xl font-black">{rfq.title}</h2>
          <p className="mt-3 text-sm leading-6" style={{ color: t.textMuted }}>
            {rfq.description || "No description provided."}
          </p>
        </div>

        <span
          className="inline-flex self-start rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: t.accentSubtle, color: t.accent }}
        >
          {statusLabel(String(rfq.status))}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          className="flex items-center gap-3 rounded-xl border p-3"
          style={{ borderColor: t.borderSubtle }}
        >
          <CalendarDays size={17} color={t.accent} />
          <div>
            <p className="text-xs" style={{ color: t.textMuted }}>
              Deadline
            </p>
            <p className="text-sm font-bold">{formatDate(rfq.deadline)}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl border p-3"
          style={{ borderColor: t.borderSubtle }}
        >
          <Package size={17} color={t.accent} />
          <div>
            <p className="text-xs" style={{ color: t.textMuted }}>
              Items
            </p>
            <p className="text-sm font-bold">{rfq.items.length}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl border p-3"
          style={{ borderColor: t.borderSubtle }}
        >
          <FileCheck2 size={17} color={t.accent} />
          <div>
            <p className="text-xs" style={{ color: t.textMuted }}>
              Vendors
            </p>
            <p className="text-sm font-bold">{rfq.vendorIDs?.length ?? 0}</p>
          </div>
        </div>
      </div>

      {rfq.items.length > 0 ? (
        <div className="mt-5 overflow-x-auto rounded-2xl border" style={{ borderColor: t.borderDefault }}>
          <table className="min-w-full text-left text-sm">
            <thead style={{ color: t.textMuted }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rfq.items.map((item) => (
                <tr
                  key={`${rfq.rfqID}-${item.rfqItemMappingID}-${item.itemName}`}
                  className="border-t"
                  style={{ borderColor: t.borderSubtle }}
                >
                  <td className="px-4 py-3 font-medium">{item.itemName}</td>
                  <td className="px-4 py-3" style={{ color: t.textMuted }}>
                    {item.unit}
                  </td>
                  <td className="px-4 py-3" style={{ color: t.textMuted }}>
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onAccept(rfq.rfqID)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: t.accent, color: t.textOnAccent }}
        >
          <Check size={18} />
          {loading ? "Updating" : "Accept"}
        </button>

        <button
          onClick={() => onDecline(rfq.rfqID)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "rgba(240,96,112,0.08)",
            borderColor: t.error,
            color: t.error,
          }}
        >
          <X size={18} />
          {loading ? "Updating" : "Decline"}
        </button>
      </div>
    </article>
  );
}

export default function Approvals() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );
  const user = useAuthStore((state) => state.user);
  const approvalRFQs = useRFQStore((state) => state.approvalRFQs);
  const loading = useRFQStore((state) => state.approvalRFQsLoading);
  const statusUpdateLoading = useRFQStore((state) => state.statusUpdateLoading);
  const fetchRFQsForApproval = useRFQStore(
    (state) => state.fetchRFQsForApproval,
  );
  const updateRFQStatus = useRFQStore((state) => state.updateRFQStatus);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const role = useMemo<RoleKey>(() => getRole(user?.role), [user?.role]);

  useEffect(() => {
    if (role === "vendor") return;

    fetchRFQsForApproval().catch((error) => {
      toast.error(
        error?.response?.data?.message || "Unable to load RFQs for approval.",
        { id: "approval-rfqs-error" },
      );
    });
  }, [fetchRFQsForApproval, role]);

  if (role === "vendor") {
    return <VendorRFQs />;
  }

  const t = tokens(theme);
  const dashboard = dashboardConfigs[role] ?? dashboardConfigs.manager;

  const handleUpdateStatus = async (
    rfqID: number,
    status: "OPEN" | "REJECTED",
  ) => {
    if (!rfqID) {
      toast.error("RFQ ID missing.");
      return;
    }

    try {
      await updateRFQStatus(rfqID, status);
      toast.success(status === "OPEN" ? "RFQ accepted." : "RFQ declined.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to update RFQ status.",
      );
    }
  };

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
                  <h1 className="mt-3 text-3xl font-black">Approval Queue</h1>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.textMuted }}>
                    Review RFQs submitted for approval and move them to open or rejected.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fetchRFQsForApproval()}
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
                      setTheme((current) =>
                        current === "dark" ? "light" : "dark",
                      )
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
                  Loading RFQs for approval...
                </div>
              ) : approvalRFQs.length === 0 ? (
                <div className="py-16 text-center">
                  <FileCheck2 className="mx-auto" size={38} color={t.textMuted} />
                  <h2 className="mt-4 text-xl font-bold">No RFQs pending approval</h2>
                  <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                    New RFQs submitted for manager approval will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {approvalRFQs.map((rfq) => (
                    <RFQApprovalCard
                      key={rfq.rfqID}
                      rfq={rfq}
                      loading={Boolean(statusUpdateLoading[rfq.rfqID])}
                      onAccept={(rfqID) => handleUpdateStatus(rfqID, "OPEN")}
                      onDecline={(rfqID) =>
                        handleUpdateStatus(rfqID, "REJECTED")
                      }
                      t={t}
                    />
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
