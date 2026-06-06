import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokens, ColorTokens, Theme } from "../colors/color";
import { useUserStore, UserRole, UserRecord } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const roleOptions: (UserRole | "All")[] = [
  "All",
  "ADMIN",
  "PROCUREMENT_OFFICER",
  "VENDOR",
  "APPROVER",
];

const statusTag = (enabled: boolean, t: ColorTokens) => {
  return {
    label: enabled ? "Active" : "Disabled",
    background: enabled ? t.accentSubtle : "rgba(240,96,112,0.12)",
    color: enabled ? t.accent : t.error,
  };
};

const roleLabel = (role?: string) => {
  if (!role) return "Unknown";

  switch (role) {
    case "ADMIN":
      return "Admin";

    case "PROCUREMENT_OFFICER":
      return "Procurement Officer";

    case "VENDOR":
      return "Vendor";

    case "APPROVER":
      return "Approver";

    default:
      return role;
  }
};

export default function UserManagement() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const t = tokens(theme);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
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

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "All">("All");
  const [selectedDeleteUser, setSelectedDeleteUser] =
    useState<UserRecord | null>(null);
  const usersRaw = useUserStore((state) => state.users);
  const users: UserRecord[] = Array.isArray(usersRaw)
    ? usersRaw
    : (usersRaw?.users ?? usersRaw?.data ?? []);
  const toggleLoading = useUserStore((state) => state.toggleLoading);
  const deleteLoading = useUserStore((state) => state.deleteLoading);
  const fetchLoading = useUserStore((state) => state.fetchLoading);
  const toggleUserEnabled = useUserStore((state) => state.toggleUserEnabled);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    fetchUsers().catch(() => {
      toast.error("Unable to load users. Please try again.", {
        id: "fetch-users-error",
      });
    });
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        roleLabel(user.role).toLowerCase().includes(search.toLowerCase());

      const matchesRole = filterRole === "All" || user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.enabled).length,
      disabled: users.filter((user) => !user.enabled).length,
      verified: users.filter((user) => user.verified).length,
    }),
    [users],
  );

  const handleToggle = async (user: UserRecord) => {
    if (user.role === "ADMIN") {
      toast.error("Admin accounts cannot be disabled.");
      return;
    }

    if (user.id == null) {
      toast.error("User ID missing.");
      return;
    }

    try {
      await toggleUserEnabled(user.id, !user.enabled);
      toast.success(
        `${user.name} is now ${!user.enabled ? "enabled" : "disabled"}`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update user status. Please try again.",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteUser) {
      return;
    }

    if (selectedDeleteUser.id == null) {
      toast.error("User ID missing");
      return;
    }

    if (selectedDeleteUser.role === "ADMIN") {
      toast.error("Admin accounts cannot be deleted.");
      setSelectedDeleteUser(null);
      return;
    }

    try {
      await deleteUser(selectedDeleteUser.id);

      toast.success(`${selectedDeleteUser.name} has been deleted.`);

      setSelectedDeleteUser(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete user. Please try again.",
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
      <div className="max-w-[1600px] mx-auto px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar t={t} navItems={dashboard.sidebarItems} />

          <main className="space-y-6 min-w-0 w-full">
          <section
            className="rounded-[28px] border p-6"
            style={{ background: t.bgSurface, borderColor: t.borderDefault }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div
                  className="text-sm uppercase tracking-[0.25em] font-semibold"
                  style={{ color: t.textLabel }}
                >
                  User Management
                </div>
                <h1
                  className="mt-3 text-3xl font-black"
                  style={{ color: t.textPrimary }}
                >
                  Manage platform users
                </h1>
                <p
                  className="mt-2 max-w-2xl text-sm leading-7"
                  style={{ color: t.textMuted }}
                >
                  Review user access, verify status, and manage account
                  enablement.
                </p>
                {fetchLoading ? (
                  <p
                    className="mt-3 text-sm font-medium"
                    style={{ color: t.accent }}
                  >
                    Loading users from server...
                  </p>
                ) : null}
              </div>

              <button
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition"
                style={{
                  background: t.accent,
                  color: t.textOnAccent,
                }}
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
              >
                {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              </button>
            </div>
          </section>

          <section
            className="rounded-[28px] border p-6"
            style={{ background: t.bgSurface, borderColor: t.borderDefault }}
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex-1 min-w-0">
                <label className="sr-only" htmlFor="user-search">
                  Search users
                </label>
                <div className="relative max-w-lg">
                  <input
                    id="user-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email or role"
                    className="w-full rounded-3xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      background: t.bgInput,
                      borderColor: t.borderDefault,
                      color: t.textPrimary,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: t.textMuted }}
                >
                  Filter role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) =>
                    setFilterRole(e.target.value as UserRole | "All")
                  }
                  className="rounded-3xl border px-4 py-3 text-sm outline-none transition cursor-pointer"
                  style={{
                    background: t.bgInput,
                    borderColor: t.borderDefault,
                    color: t.textPrimary,
                  }}
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All" : roleLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section
            className="rounded-[28px] border p-6"
            style={{ background: t.bgSurface, borderColor: t.borderDefault }}
          >
            {fetchLoading ? (
              <div
                className="flex min-h-[280px] items-center justify-center"
                role="status"
                aria-live="polite"
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="h-10 w-10 animate-spin rounded-full border-4"
                    style={{
                      borderColor: t.borderDefault,
                      borderTopColor: t.accent,
                    }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: t.textMuted }}
                  >
                    Loading users...
                  </p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
                <div
                  className="rounded-3xl border border-dashed px-6 py-8"
                  style={{ borderColor: t.borderDefault }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: t.textMuted }}
                  >
                    No users found
                  </p>
                </div>
                <p
                  className="max-w-sm text-sm leading-6"
                  style={{ color: t.textLabel }}
                >
                  Update search terms or clear the role filter to view all
                  users.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table
                    className="min-w-full border-separate"
                    style={{ borderSpacing: 0 }}
                  >
                    <thead>
                      <tr
                        className="text-left text-[0.7rem] uppercase tracking-[0.24em] font-semibold"
                        style={{ color: t.textLabel }}
                      >
                        <th className="pb-4 pr-6">Name</th>
                        <th className="pb-4 pr-6">Email</th>
                        <th className="pb-4 pr-6">Role</th>
                        <th className="pb-4 pr-6">Verified</th>
                        <th className="pb-4 pr-6">Status</th>
                        <th className="pb-4 pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const tag = statusTag(user.enabled, t);
                        return (
                          <tr
                            key={user.id}
                            className="border-t transition"
                            style={{ borderColor: t.borderSubtle }}
                          >
                            <td
                              className="py-4 pr-6 font-semibold"
                              style={{ color: t.textPrimary }}
                            >
                              {user.name}
                            </td>
                            <td
                              className="py-4 pr-6"
                              style={{ color: t.textMuted }}
                            >
                              {user.email}
                            </td>
                            <td
                              className="py-4 pr-6"
                              style={{ color: t.textSecondary }}
                            >
                              {roleLabel(user.role)}
                            </td>
                            <td
                              className="py-4 pr-6"
                              style={{ color: t.textSecondary }}
                            >
                              <span
                                className="rounded-full px-3 py-1 text-[0.75rem] font-semibold"
                                style={{
                                  background: user.verified
                                    ? t.accentSubtle
                                    : "rgba(255,255,255,0.05)",
                                  color: user.verified ? t.accent : t.textMuted,
                                }}
                              >
                                {user.verified ? "Verified" : "Unverified"}
                              </span>
                            </td>
                            <td className="py-4 pr-6">
                              <span
                                className="rounded-full px-3 py-1 text-[0.75rem] font-semibold"
                                style={{
                                  background: tag.background,
                                  color: tag.color,
                                }}
                              >
                                {tag.label}
                              </span>
                            </td>
                            <td className="py-4 pr-6">
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => handleToggle(user)}
                                  disabled={
                                    user.role === "ADMIN" ||
                                    toggleLoading[user.id]
                                  }
                                  className="inline-flex h-12 items-center rounded-3xl border px-4 text-sm font-semibold transition"
                                  style={{
                                    background: t.bgCard,
                                    borderColor:
                                      user.role === "ADMIN"
                                        ? t.borderDefault
                                        : t.accent,
                                    color:
                                      user.role === "ADMIN"
                                        ? t.textMuted
                                        : t.textPrimary,
                                  }}
                                >
                                  <span className="mr-3 text-xs uppercase tracking-[0.22em]">
                                    {user.enabled ? "Enabled" : "Disabled"}
                                  </span>
                                  <span
                                    className="relative inline-flex h-6 w-11 items-center rounded-full"
                                    style={{
                                      background: user.enabled
                                        ? t.accentSubtle
                                        : t.borderSubtle,
                                    }}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${user.enabled ? "translate-x-5" : "translate-x-1"}`}
                                    />
                                  </span>
                                  {toggleLoading[user.id] ? (
                                    <span className="ml-3 text-xs">
                                      Saving...
                                    </span>
                                  ) : null}
                                </button>
                                <button
                                  onClick={() => {
                                    console.log("DELETE BUTTON CLICKED");
                                    console.log("USER OBJECT =", user);
                                    console.log("USER ID =", user?.id);

                                    setSelectedDeleteUser(user);
                                  }}
                                  disabled={
                                    user.role === "ADMIN" ||
                                    deleteLoading[user.id]
                                  }
                                  className="inline-flex h-12 items-center justify-center rounded-3xl border px-3 text-sm font-semibold transition"
                                  style={{
                                    background: t.bgCard,
                                    borderColor:
                                      user.role === "ADMIN"
                                        ? t.borderDefault
                                        : t.error,
                                    color:
                                      user.role === "ADMIN"
                                        ? t.textMuted
                                        : t.error,
                                  }}
                                  aria-label={`Delete ${user.name}`}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9 3h6l1 1h5v2H4V4h5l1-1Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M6 7h12l-1 14H7L6 7Zm3 3v8h2V10H9Zm4 0v8h2V10h-2Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 md:hidden">
                  {filteredUsers.map((user) => {
                    const tag = statusTag(user.enabled, t);
                    return (
                      <article
                        key={user.id}
                        className="rounded-[28px] border p-5"
                        style={{
                          background: t.bgCard,
                          borderColor: t.borderDefault,
                        }}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p
                              className="font-semibold"
                              style={{ color: t.textPrimary }}
                            >
                              {user.name}
                            </p>
                            <p
                              className="text-sm text-slate-400"
                              style={{ color: t.textMuted }}
                            >
                              {user.email}
                            </p>
                            <p
                              className="mt-2 text-sm"
                              style={{ color: t.textSecondary }}
                            >
                              {roleLabel(user.role)} •{" "}
                              {user.verified ? "Verified" : "Unverified"}
                            </p>
                          </div>
                          <div className="space-y-2 text-right">
                            <span
                              className="inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold"
                              style={{
                                background: tag.background,
                                color: tag.color,
                              }}
                            >
                              {tag.label}
                            </span>
                            <button
                              onClick={() => handleToggle(user)}
                              disabled={
                                user.role === "ADMIN" || toggleLoading[user.id]
                              }
                              className="inline-flex h-12 items-center rounded-3xl border px-4 text-sm font-semibold transition"
                              style={{
                                background: t.bgCard,
                                borderColor:
                                  user.role === "ADMIN"
                                    ? t.borderDefault
                                    : t.accent,
                                color:
                                  user.role === "ADMIN"
                                    ? t.textMuted
                                    : t.textPrimary,
                              }}
                            >
                              <span
                                className="relative inline-flex h-6 w-11 items-center rounded-full"
                                style={{
                                  background: user.enabled
                                    ? t.accentSubtle
                                    : t.borderSubtle,
                                }}
                              >
                                <span
                                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${user.enabled ? "translate-x-5" : "translate-x-1"}`}
                                />
                              </span>
                              <span className="ml-3 text-xs uppercase tracking-[0.22em]">
                                {toggleLoading[user.id]
                                  ? "Saving..."
                                  : user.enabled
                                    ? "Enabled"
                                    : "Disabled"}
                              </span>
                            </button>
                            <button
                              onClick={() => setSelectedDeleteUser(user)}
                              disabled={
                                user.role === "ADMIN" || deleteLoading[user.id]
                              }
                              className="inline-flex h-12 items-center justify-center rounded-3xl border px-3 text-sm font-semibold transition"
                              style={{
                                background: t.bgCard,
                                borderColor:
                                  user.role === "ADMIN"
                                    ? t.borderDefault
                                    : t.error,
                                color:
                                  user.role === "ADMIN" ? t.textMuted : t.error,
                              }}
                              aria-label={`Delete ${user.name}`}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 3h6l1 1h5v2H4V4h5l1-1Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M6 7h12l-1 14H7L6 7Zm3 3v8h2V10H9Zm4 0v8h2V10h-2Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
          </main>
        </div>
      </div>

      {selectedDeleteUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            className="w-full max-w-lg rounded-[32px] border p-6 shadow-2xl"
            style={{ background: t.bgCard, borderColor: t.borderDefault }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-sm uppercase tracking-[0.24em] font-semibold"
                  style={{ color: t.textLabel }}
                >
                  Confirm delete
                </p>
                <h2
                  className="mt-3 text-2xl font-black"
                  style={{ color: t.textPrimary }}
                >
                  Delete {selectedDeleteUser.name}?
                </h2>
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: t.textMuted }}
                >
                  This will remove access for the user and cannot be undone from
                  this screen.
                </p>
              </div>
              <button
                onClick={() => setSelectedDeleteUser(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition"
                style={{
                  borderColor: t.borderDefault,
                  color: t.textSecondary,
                  background: t.bgCard,
                }}
                aria-label="Close confirmation"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedDeleteUser(null)}
                className="rounded-3xl border px-5 py-3 text-sm font-semibold transition"
                style={{
                  borderColor: t.borderDefault,
                  color: t.textPrimary,
                  background: t.bgSurface,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={
                  selectedDeleteUser
                    ? deleteLoading[selectedDeleteUser.id]
                    : false
                }
                className="rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
              >
                {selectedDeleteUser && deleteLoading[selectedDeleteUser.id]
                  ? "Deleting..."
                  : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
