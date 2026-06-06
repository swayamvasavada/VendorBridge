import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  PackageCheck,
  Send,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { tokens, Theme } from "../colors/color";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";

type Decision = "approved" | "rejected" | null;

const workflowSteps = [
  { label: "Submitted", icon: Send },
  { label: "L1 Review", icon: FileCheck2 },
  { label: "L2 Approval", icon: ShieldCheck },
  { label: "Generate PO", icon: PackageCheck },
];

export default function Approvals() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );
  const [remarks, setRemarks] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const dashboard = dashboardConfigs[role] ?? dashboardConfigs.admin;

  const handleDecision = (nextDecision: Exclude<Decision, null>) => {
    setDecision(nextDecision);
    toast.success(
      nextDecision === "approved"
        ? "Quotation approved successfully."
        : "Quotation sent back for review.",
    );
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
              style={{
                background: t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.25em]"
                    style={{ color: t.textLabel }}
                  >
                    VendorBridge • {dashboard.roleLabel}
                  </p>
                  <h1
                    className="mt-3 text-3xl font-black"
                    style={{ color: t.textPrimary }}
                  >
                    Approval workflow
                  </h1>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: t.textMuted }}
                  >
                    RFQ: Office Furniture Q2 • Infra Supplies Pvt Ltd • ₹1,85,400
                  </p>
                </div>

                <button
                  onClick={() =>
                    setTheme((current) =>
                      current === "dark" ? "light" : "dark",
                    )
                  }
                  className="self-start rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                  style={{
                    background: t.bgCard,
                    borderColor: t.borderDefault,
                    color: t.textPrimary,
                  }}
                >
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </section>

            <section
              className="overflow-x-auto rounded-[28px] border p-6"
              style={{
                background: t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <div className="min-w-[680px]">
                <div className="grid grid-cols-4">
                  {workflowSteps.map((step, index) => {
                    const isComplete = index < 2;
                    const isCurrent = index === 2;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.label} className="relative text-center">
                        {index < workflowSteps.length - 1 ? (
                          <div
                            className="absolute left-[58%] right-[-42%] top-6 h-px"
                            style={{
                              background:
                                index < 2 ? t.accent : t.borderStrong,
                            }}
                          />
                        ) : null}
                        <div
                          className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border"
                          style={{
                            background:
                              isComplete || isCurrent
                                ? t.accentSubtle
                                : t.bgCard,
                            borderColor:
                              isComplete || isCurrent
                                ? t.accent
                                : t.borderDefault,
                            color:
                              isComplete || isCurrent
                                ? t.accent
                                : t.textMuted,
                          }}
                        >
                          {isComplete ? (
                            <Check size={19} strokeWidth={3} />
                          ) : (
                            <StepIcon size={19} />
                          )}
                        </div>
                        <p
                          className="mt-3 text-sm font-bold"
                          style={{
                            color: isCurrent ? t.accent : t.textPrimary,
                          }}
                        >
                          {step.label}
                        </p>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: t.textMuted }}
                        >
                          {isComplete
                            ? "Completed"
                            : isCurrent
                              ? "Awaiting decision"
                              : "Next step"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <section
                className="rounded-[28px] border p-6"
                style={{
                  background: t.bgSurface,
                  borderColor: t.borderDefault,
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color: t.textLabel }}
                    >
                      Approval chain
                    </p>
                    <h2
                      className="mt-2 text-xl font-bold"
                      style={{ color: t.textPrimary }}
                    >
                      Review history
                    </h2>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: t.accentSubtle,
                      color: t.accent,
                    }}
                  >
                    Step 2 of 3
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div
                    className="flex gap-4 rounded-2xl border p-4"
                    style={{
                      background: t.bgCard,
                      borderColor: t.borderDefault,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background: "rgba(61,214,140,0.12)",
                        color: t.success,
                      }}
                    >
                      <CheckCircle2 size={21} />
                    </div>
                    <div>
                      <p className="font-bold">Rahul Mehta</p>
                      <p className="mt-1 text-sm" style={{ color: t.textMuted }}>
                        Procurement Head • L1 reviewer
                      </p>
                      <p
                        className="mt-2 text-xs font-semibold"
                        style={{ color: t.success }}
                      >
                        Approved on May 20 at 10:32 AM
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-4 rounded-2xl border p-4"
                    style={{
                      background: t.bgCard,
                      borderColor: t.accent,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background: t.accentSubtle,
                        color: t.accent,
                      }}
                    >
                      <Clock3 size={21} />
                    </div>
                    <div>
                      <p className="font-bold">Priya Shah</p>
                      <p className="mt-1 text-sm" style={{ color: t.textMuted }}>
                        Finance Manager • L2 approver
                      </p>
                      <p
                        className="mt-2 text-xs font-semibold"
                        style={{ color: t.accent }}
                      >
                        Awaiting action • Assigned May 21
                      </p>
                    </div>
                  </div>
                </div>

                <label
                  className="mt-6 block text-xs font-bold uppercase tracking-[0.2em]"
                  htmlFor="approval-remarks"
                  style={{ color: t.textLabel }}
                >
                  Approval remarks
                </label>
                <textarea
                  id="approval-remarks"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows={5}
                  placeholder="Add comments, conditions, or a reason for your decision..."
                  className="mt-3 w-full resize-none rounded-2xl border p-4 text-sm outline-none transition"
                  style={{
                    background: t.bgInput,
                    borderColor: t.borderDefault,
                    color: t.textPrimary,
                  }}
                />
                <div className="mt-2 text-right text-xs" style={{ color: t.textMuted }}>
                  {remarks.length}/500
                </div>
              </section>

              <section
                className="rounded-[28px] border p-6"
                style={{
                  background: t.bgSurface,
                  borderColor: t.borderDefault,
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.22em]"
                  style={{ color: t.textLabel }}
                >
                  Quotation summary
                </p>
                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: t.textMuted }}
                    >
                      Selected vendor
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Infra Supplies Pvt Ltd
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                      Office furniture and workspace solutions
                    </p>
                  </div>
                  <span
                    className="inline-flex self-start rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{
                      background: "rgba(61,214,140,0.12)",
                      color: t.success,
                    }}
                  >
                    Best evaluated bid
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Quotation total", "₹1,85,400"],
                    ["Delivery period", "10 days"],
                    ["Payment terms", "Net 30"],
                    ["Quotation ID", "QT-2025-184"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border p-4"
                      style={{
                        background: t.bgCard,
                        borderColor: t.borderDefault,
                      }}
                    >
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        {label}
                      </p>
                      <p className="mt-2 font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-3 flex items-center justify-between rounded-2xl border p-4"
                  style={{
                    background: t.bgCard,
                    borderColor: t.borderDefault,
                  }}
                >
                  <div>
                    <p className="text-xs" style={{ color: t.textMuted }}>
                      Vendor rating
                    </p>
                    <p className="mt-2 font-bold">4.5 out of 5</p>
                  </div>
                  <div className="flex gap-1" style={{ color: t.warning }}>
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        size={17}
                        fill={star < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className="mt-6 rounded-2xl border p-4"
                  style={{
                    background:
                      decision === "approved"
                        ? "rgba(61,214,140,0.10)"
                        : decision === "rejected"
                          ? "rgba(240,96,112,0.10)"
                          : t.bgCard,
                    borderColor:
                      decision === "approved"
                        ? t.success
                        : decision === "rejected"
                          ? t.error
                          : t.borderDefault,
                  }}
                >
                  <p className="text-xs font-semibold" style={{ color: t.textMuted }}>
                    Decision status
                  </p>
                  <p
                    className="mt-2 font-bold"
                    style={{
                      color:
                        decision === "approved"
                          ? t.success
                          : decision === "rejected"
                            ? t.error
                            : t.textPrimary,
                    }}
                  >
                    {decision === "approved"
                      ? "Approved for purchase order"
                      : decision === "rejected"
                        ? "Returned for review"
                        : "Your decision is pending"}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleDecision("approved")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition hover:opacity-90"
                    style={{
                      background: t.accent,
                      color: t.textOnAccent,
                    }}
                  >
                    <Check size={18} />
                    Approve quotation
                  </button>
                  <button
                    onClick={() => handleDecision("rejected")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold transition"
                    style={{
                      background: "rgba(240,96,112,0.08)",
                      borderColor: t.error,
                      color: t.error,
                    }}
                  >
                    <X size={18} />
                    Reject quotation
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
