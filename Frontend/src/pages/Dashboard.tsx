import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import { tokens, ColorTokens, Theme } from "../colors/color";
import Sidebar from "../components/Sidebar";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";

const timelineEvents = [
  {
    title: "Quotation submitted",
    detail: "RFQ-0274 received 5 quotations.",
    time: "2 hrs ago",
  },
  {
    title: "PO approved",
    detail: "PO-193 is ready for vendor assignment.",
    time: "5 hrs ago",
  },
  {
    title: "Invoice paid",
    detail: "Invoice INV-183 was marked as paid.",
    time: "1 day ago",
  },
];

function statBar(color: string) {
  return <div className="h-1.5 rounded-full" style={{ background: color }} />;
}

export default function Dashboard() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  const t = tokens(theme);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const role = useMemo<RoleKey>(() => {
    switch (user?.role?.toUpperCase()) {
      case "ADMIN":
        return "admin";

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
  const userRoleLabel = user?.role
    ? user.role.replace("_", " ")
    : dashboard.roleLabel;

  const activeLabel = useMemo(() => {
    const currentPath = location.pathname;
    const activeItem = dashboard.sidebarItems.find(
      (item) => item.path === currentPath,
    );
    return activeItem?.label || "Dashboard";
  }, [dashboard.sidebarItems, location.pathname]);

  if (!user) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10"
        style={{
          background: t.bgPage,
          color: t.textPrimary,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          className="max-w-xl w-full rounded-[28px] border bg-white/90 p-10 shadow-2xl"
          style={{ borderColor: t.borderDefault, background: t.bgSurface }}
        >
          <h1 className="text-3xl font-bold" style={{ color: t.textPrimary }}>
            Welcome to VendorBridge
          </h1>
          <p className="mt-4 text-sm leading-7" style={{ color: t.textMuted }}>
            Your dashboard is ready once you log in. Role-based access will
            dynamically render the sidebar, KPIs, charts and actions.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-2xl px-6 py-3 text-sm font-semibold transition"
            style={{ background: t.accent, color: t.textOnAccent }}
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: t.bgPage,
        color: t.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar t={t} navItems={dashboard.sidebarItems} />

          <main className="space-y-6 min-w-0 w-full">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div
                className="rounded-[28px] border p-6"
                style={{
                  background: t.bgSurface,
                  borderColor: t.borderDefault,
                }}
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div
                      className="text-sm uppercase tracking-[0.25em] font-semibold"
                      style={{ color: t.textLabel }}
                    >
                      VendorBridge • {dashboard.roleLabel}
                    </div>
                    <h1
                      className="mt-3 text-3xl font-black"
                      style={{ color: t.textPrimary }}
                    >
                      {activeLabel}
                    </h1>
                    <p
                      className="mt-3 max-w-2xl text-sm leading-7"
                      style={{ color: t.textMuted }}
                    >
                      {dashboard.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-auto">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        placeholder="Search procurement, vendors, quotes..."
                        className="w-full rounded-3xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-300"
                        style={{
                          background: t.bgInput,
                          borderColor: t.borderDefault,
                          color: t.textPrimary,
                        }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border transition"
                      style={{
                        background: t.bgCard,
                        borderColor: t.borderDefault,
                        color: t.textPrimary,
                      }}
                    >
                      {theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </button>
                    <button
                      className="flex h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition"
                      style={{
                        background: t.bgCard,
                        borderColor: t.borderDefault,
                        color: t.textPrimary,
                      }}
                    >
                      <div className="relative">
                        <Bell size={18} />

                        {dashboard.notifications?.length ? (
                          <span
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                            style={{
                              background: t.accent,
                              color: t.textOnAccent,
                            }}
                          >
                            {dashboard.notifications.length}
                          </span>
                        ) : null}
                      </div>
                      Notifications
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition"
                      style={{
                        background: t.accent,
                        borderColor: t.accent,
                        color: t.textOnAccent,
                      }}
                    >
                      <User size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="rounded-[28px] border p-6"
                style={{
                  background: t.bgSurface,
                  borderColor: t.borderDefault,
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.25em] font-semibold"
                      style={{ color: t.textLabel }}
                    >
                      Quick Actions
                    </p>
                    <h2
                      className="mt-2 text-xl font-bold"
                      style={{ color: t.textPrimary }}
                    >
                      Ready for your next step
                    </h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dashboard.quickActions.map((action) => (
                    <button
                      key={action.action}
                      className="rounded-3xl border px-4 py-4 text-left text-sm font-semibold transition"
                      style={{
                        background: t.bgCard,
                        color: t.textPrimary,
                        borderColor: t.borderDefault,
                      }}
                      onClick={() => undefined}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboard.kpiCards.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[28px] border p-6"
                  style={{
                    background: t.bgSurface,
                    borderColor: t.borderDefault,
                  }}
                >
                  <p
                    className="text-[0.68rem] uppercase tracking-[0.28em] font-semibold"
                    style={{ color: t.textLabel }}
                  >
                    {item.label}
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p
                        className="text-3xl font-black"
                        style={{ color: t.textPrimary }}
                      >
                        {item.value}
                      </p>
                      <p
                        className="mt-2 text-sm"
                        style={{ color: t.textMuted }}
                      >
                        {item.hint}
                      </p>
                    </div>
                    <div
                      className="h-12 w-12 rounded-3xl flex items-center justify-center"
                      style={{ background: t.accentSubtle }}
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: t.accent }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div
                className="rounded-[28px] border p-6"
                style={{
                  background: t.bgSurface,
                  borderColor: t.borderDefault,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.25em] font-semibold"
                      style={{ color: t.textLabel }}
                    >
                      Analytics
                    </p>
                    <h2
                      className="mt-2 text-2xl font-bold"
                      style={{ color: t.textPrimary }}
                    >
                      {dashboard.title}
                    </h2>
                  </div>
                  <div
                    className="flex items-center gap-3 text-sm font-semibold"
                    style={{ color: t.textMuted }}
                  >
                    <TrendingUp size={18} /> Live performance
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-3">
                  {dashboard.chartCards.map((chart) => (
                    <div
                      key={chart.title}
                      className="rounded-[28px] border p-5"
                      style={{
                        background: t.bgCard,
                        borderColor: t.borderDefault,
                      }}
                    >
                      <p
                        className="text-xs uppercase tracking-[0.24em] font-semibold"
                        style={{ color: t.textLabel }}
                      >
                        {chart.subtitle}
                      </p>
                      <h3
                        className="mt-3 text-lg font-bold"
                        style={{ color: t.textPrimary }}
                      >
                        {chart.title}
                      </h3>
                      <p
                        className="mt-3 text-sm leading-6"
                        style={{ color: t.textMuted }}
                      >
                        {chart.description}
                      </p>
                      <div className="mt-5 space-y-2">
                        {statBar(t.accent)}
                        {statBar(t.accentSubtle)}
                        {statBar(t.borderSubtle)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <div
                  className="rounded-[28px] border p-6"
                  style={{
                    background: t.bgSurface,
                    borderColor: t.borderDefault,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className="text-sm uppercase tracking-[0.25em] font-semibold"
                        style={{ color: t.textLabel }}
                      >
                        Activity Timeline
                      </p>
                      <h3
                        className="mt-2 text-xl font-bold"
                        style={{ color: t.textPrimary }}
                      >
                        Recent updates
                      </h3>
                    </div>
                    <Activity size={20} color={t.accent} />
                  </div>

                  <div className="mt-6 space-y-4">
                    {timelineEvents.map((event) => (
                      <div
                        key={event.title}
                        className="rounded-3xl border p-4"
                        style={{ borderColor: t.borderDefault }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className="font-semibold"
                            style={{ color: t.textPrimary }}
                          >
                            {event.title}
                          </p>
                          <span
                            className="text-xs uppercase tracking-[0.24em]"
                            style={{ color: t.textLabel }}
                          >
                            {event.time}
                          </span>
                        </div>
                        <p
                          className="mt-2 text-sm"
                          style={{ color: t.textMuted }}
                        >
                          {event.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-[28px] border p-6"
                  style={{
                    background: t.bgSurface,
                    borderColor: t.borderDefault,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className="text-sm uppercase tracking-[0.25em] font-semibold"
                        style={{ color: t.textLabel }}
                      >
                        Role overview
                      </p>
                      <h3
                        className="mt-2 text-xl font-bold"
                        style={{ color: t.textPrimary }}
                      >
                        {dashboard.roleLabel}
                      </h3>
                    </div>
                    <div
                      className="rounded-3xl bg-slate-900/5 px-3 py-2 text-xs font-semibold"
                      style={{ color: t.textPrimary }}
                    >
                      {userRoleLabel}
                    </div>
                  </div>
                  <p className="mt-4 text-sm" style={{ color: t.textMuted }}>
                    The dashboard view, navigation items, and actions on this
                    page are generated based on your authenticated role.
                  </p>
                </div>

                {dashboard.notifications?.length ? (
                  <div
                    className="rounded-[28px] border p-6"
                    style={{
                      background: t.bgSurface,
                      borderColor: t.borderDefault,
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p
                          className="text-sm uppercase tracking-[0.25em] font-semibold"
                          style={{ color: t.textLabel }}
                        >
                          Notifications
                        </p>
                        <h3
                          className="mt-2 text-xl font-bold"
                          style={{ color: t.textPrimary }}
                        >
                          Latest alerts
                        </h3>
                      </div>
                      <span
                        className="rounded-3xl bg-teal-100 px-3 py-2 text-sm font-semibold"
                        style={{ color: t.accent }}
                      >
                        {dashboard.notifications.length} new
                      </span>
                    </div>
                    <div className="mt-5 space-y-4">
                      {dashboard.notifications.map((notification) => (
                        <div
                          key={notification.title}
                          className="rounded-3xl border p-4"
                          style={{ borderColor: t.borderDefault }}
                        >
                          <p
                            className="font-semibold"
                            style={{ color: t.textPrimary }}
                          >
                            {notification.title}
                          </p>
                          <p
                            className="mt-2 text-sm"
                            style={{ color: t.textMuted }}
                          >
                            {notification.message}
                          </p>
                          <p
                            className="mt-3 text-xs uppercase tracking-[0.2em]"
                            style={{ color: t.textLabel }}
                          >
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
