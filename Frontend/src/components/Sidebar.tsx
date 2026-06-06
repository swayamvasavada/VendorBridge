import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ColorTokens } from "../colors/color";
import { DashboardNavItem } from "../config/dashboardConfig";

function Icon({
  d,
  color,
}: {
  d: string;
  color: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({
  t,
  navItems,
  activePathOverride,
}: {
  t: ColorTokens;
  navItems?: DashboardNavItem[];
  activePathOverride?: string;
}) {
  const location = useLocation();
  const activePath = activePathOverride ?? location.pathname;
  const items = navItems ?? [];
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className="hidden lg:block lg:sticky lg:top-6 lg:self-start"
        aria-label="Primary navigation"
      >
        <div
          className="flex max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-[28px] border p-3"
          style={{
            background: t.bgSurface,
            borderColor: t.borderDefault,
            boxShadow: t.shadow,
          }}
        >
          <div
            className="mb-3 rounded-2xl border px-4 py-4"
            style={{
              background: t.bgCard,
              borderColor: t.borderSubtle,
            }}
          >
            <div
              className="text-[0.65rem] font-bold uppercase tracking-[0.24em]"
              style={{ color: t.logoText }}
            >
              VendorBridge
            </div>
            <p
              className="mt-1.5 text-xs"
              style={{ color: t.textMuted }}
            >
              Procurement workspace
            </p>
          </div>

          <div className="space-y-1 overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = item.path === activePath;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200"
                  style={{
                    background: isActive ? t.accentSubtle : "transparent",
                    borderColor: isActive ? t.accent : "transparent",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isActive ? t.accent : t.bgCard,
                    }}
                  >
                    <Icon
                      d={item.icon}
                      color={isActive ? t.textOnAccent : t.textMuted}
                    />
                  </span>

                  <span
                    className="min-w-0 truncate text-sm font-medium"
                    style={{
                      color: isActive ? t.textPrimary : t.textMuted,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div
        className="sticky top-0 z-40 lg:hidden rounded-2xl border backdrop-blur-xl"
        style={{
          background: `${t.bgCard}ee`,
          borderColor: t.borderDefault,
        }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl transition"
            style={{
              background: t.bgSurface,
            }}
          >
            <Menu
              size={22}
              color={t.textPrimary}
            />
          </button>

          <div
            className="font-bold text-sm"
            style={{
              color: t.textPrimary,
            }}
          >
            VendorBridge
          </div>

          <div className="w-10" />
        </div>
      </div>

      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        style={{
          background: t.bgCard,
          borderRight: `1px solid ${t.borderDefault}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{
            borderColor: t.borderDefault,
          }}
        >
          <div>
            <div
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{
                color: t.textLabel,
              }}
            >
              VendorBridge
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl"
            style={{
              background: t.bgSurface,
            }}
          >
            <X
              size={18}
              color={t.textPrimary}
            />
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive =
              item.path === activePath;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
                style={{
                  background: isActive
                    ? t.accentSubtle
                    : "transparent",
                  border: `1px solid ${
                    isActive
                      ? t.accent
                      : "transparent"
                  }`,
                }}
              >
                <Icon
                  d={item.icon}
                  color={
                    isActive
                      ? t.accent
                      : t.textMuted
                  }
                />

                <span
                  className="text-sm font-medium"
                  style={{
                    color: isActive
                      ? t.textPrimary
                      : t.textMuted,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
