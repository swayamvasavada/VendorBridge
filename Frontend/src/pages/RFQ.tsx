import { useEffect, useMemo, useState } from "react";
import { tokens, Theme } from "../colors/color";
import Sidebar from "../components/Sidebar";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";
import { RFQPayload, RFQStatus, useRFQStore } from "../store/rfqStore";
import toast from "react-hot-toast";
import { UserRecord, useUserStore } from "../store/userStore";

interface LineItem {
  id: number;
  item: string;
  qty: number;
  unit: string;
}

export default function CreateRFQPage() {
  const theme: Theme = "dark";
  const t = tokens(theme);

  // Grab the same authenticated user context as the Dashboard / Vendor page
  const user = useAuthStore((state) => state.user);
  const createRFQ = useRFQStore((state) => state.createRFQ);
  const loadingStatus = useRFQStore((state) => state.loadingStatus);
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const usersLoading = useUserStore((state) => state.fetchLoading);

  // Compute the dynamic configuration matching the sidebar navigation layout
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

  // Form State
  const [rfqTitle, setRfqTitle] = useState("Office Furniture procurement Q2");
  const [category, setCategory] = useState("Furniture");
  const [deadline, setDeadline] = useState(new Date(Date.now()).toISOString().split("T")[0]);
  const [description, setDescription] = useState("Ergonomic chairs and standing desks for 3rd floor");

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, item: "Ergonomic chair", qty: 25, unit: "NOS" },
    { id: 2, item: "Standing desks", qty: 10, unit: "NOS" },
  ]);

  // Assigned Vendors State
  const [assignedVendors, setAssignedVendors] = useState<UserRecord[]>([]);
  const [showVendorPicker, setShowVendorPicker] = useState(false);

  useEffect(() => {
    fetchUsers().catch((error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to load vendor users.",
        { id: "rfq-vendors-error" },
      );
    });
  }, [fetchUsers]);

  const availableVendors = useMemo(
    () =>
      users.filter(
        (candidate) =>
          candidate.role?.toUpperCase() === "VENDOR" &&
          candidate.id != null &&
          !assignedVendors.some((vendor) => vendor.id === candidate.id),
      ),
    [assignedVendors, users],
  );

  // Handle adding new line items
  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: Date.now(),
      item: "",
      qty: 1,
      unit: "NOS",
    };
    setLineItems([...lineItems, newItem]);
  };

  // Safe typed update helper for line items
  const handleUpdateLineItem = <K extends keyof LineItem>(
    id: number,
    field: K,
    value: LineItem[K]
  ) => {
    setLineItems(
      lineItems.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveLineItem = (id: number) => {
    setLineItems(lineItems.filter((row) => row.id !== id));
  };

  const handleAddVendor = (vendor: UserRecord) => {
    if (vendor.id == null) {
      toast.error("Vendor ID is missing.");
      return;
    }

    setAssignedVendors((current) => [...current, vendor]);
    setShowVendorPicker(false);
  };

  const handleOpenVendorPicker = () => {
    if (!usersLoading && availableVendors.length === 0) {
      const hasVendorUsers = users.some(
        (candidate) => candidate.role?.toUpperCase() === "VENDOR",
      );
      toast.error(
        hasVendorUsers
          ? "All available vendors are already assigned."
          : "No vendor users are available.",
      );
      return;
    }

    setShowVendorPicker((current) => !current);
  };

  const handleSubmitRFQ = async (status: RFQStatus) => {
    if (!rfqTitle.trim() || !deadline) {
      toast.error("RFQ title and deadline are required.");
      return;
    }

    if (
      lineItems.some(
        (item) => !item.item.trim() || !item.unit.trim() || item.qty <= 0,
      )
    ) {
      toast.error("Complete every line item with a valid quantity.");
      return;
    }

    if (assignedVendors.length === 0) {
      toast.error("Assign at least one vendor.");
      return;
    }

    const payload: RFQPayload = {
      rfqID: 0,
      title: rfqTitle.trim(),
      description: description.trim(),
      deadline: new Date(`${deadline}T23:59:59`).toISOString(),
      status,
      items: lineItems.map((item) => ({
        rfqItemMappingID: 0,
        itemName: item.item.trim(),
        unit: item.unit.trim(),
        quantity: item.qty,
      })),
      vendorIDs: assignedVendors.map((vendor) => vendor.id),
    };

    try {
      await createRFQ(payload);
      toast.success(
        status === "DRAFT"
          ? "RFQ draft saved successfully."
          : "RFQ submitted for approval.",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create RFQ.",
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
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          
          {/* Synchronized Sidebar feeding data dynamically based on active user context */}
          <Sidebar t={t} navItems={dashboard.sidebarItems} />

          <main className="space-y-6 min-w-0 w-full">
            {/* Header Section */}
            <section
              className="rounded-3xl border p-6"
              style={{
                background: t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <div>
                <div
                  className="text-sm uppercase tracking-[0.25em] font-semibold"
                  style={{ color: t.textLabel }}
                >
                  VendorBridge • {dashboard.roleLabel}
                </div>
                <h1 className="mt-3 text-3xl font-black" style={{ color: t.textPrimary }}>
                  Create RFQ's
                </h1>
              </div>
            </section>

            {/* Main Interactive Workspace */}
            <div className="grid gap-6 lg:grid-cols-2">
              
              {/* Left Column: RFQ Metadata Inputs */}
              <div
                className="rounded-3xl border p-6 space-y-4"
                style={{ background: t.bgSurface, borderColor: t.borderDefault }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    RFQ's title*
                  </label>
                  <input
                    type="text"
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    className="rounded-xl border p-3 text-sm bg-transparent outline-none focus:border-opacity-100"
                    style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border p-3 text-sm bg-transparent outline-none"
                    style={{ borderColor: t.borderSubtle, color: t.textPrimary, background: t.bgSurface }}
                  >
                    <option value="Furniture" style={{ background: t.bgSurface }}>Furniture</option>
                    <option value="IT" style={{ background: t.bgSurface }}>IT Equipment</option>
                    <option value="Construction" style={{ background: t.bgSurface }}>Construction</option>
                    <option value="Logistics" style={{ background: t.bgSurface }}>Logistics</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    Deadline*
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="rounded-xl border p-3 text-sm bg-transparent outline-none"
                    style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl border p-3 text-sm bg-transparent outline-none resize-none"
                    style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                  />
                </div>
              </div>

              {/* Right Column: Line Items & Assigned Vendors */}
              <div className="space-y-6">
                
                {/* Line Items Sub-Box */}
                <div
                  className="rounded-3xl border p-6 space-y-4"
                  style={{ background: t.bgSurface, borderColor: t.borderDefault }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    Line Items
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: t.borderSubtle, color: t.textMuted }}>
                          <th className="py-2 font-medium">Item</th>
                          <th className="py-2 px-2 font-medium w-20">Qty</th>
                          <th className="py-2 px-2 font-medium w-24">Unit</th>
                          <th className="py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((row) => (
                          <tr key={row.id} className="border-b last:border-none" style={{ borderColor: t.borderSubtle }}>
                            <td className="py-3 pr-2">
                              <input
                                type="text"
                                value={row.item}
                                onChange={(e) => handleUpdateLineItem(row.id, "item", e.target.value)}
                                placeholder="Item name"
                                className="w-full bg-transparent border-b border-transparent focus:border-opacity-40 outline-none py-1"
                                style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row.qty}
                                onChange={(e) => handleUpdateLineItem(row.id, "qty", parseInt(e.target.value) || 0)}
                                className="w-full bg-transparent border-b border-transparent focus:border-opacity-40 outline-none py-1 font-mono"
                                style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                value={row.unit}
                                onChange={(e) => handleUpdateLineItem(row.id, "unit", e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-opacity-40 outline-none py-1 font-mono uppercase"
                                style={{ borderColor: t.borderSubtle, color: t.textPrimary }}
                              />
                            </td>
                            <td className="py-3 text-right">
                              {lineItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLineItem(row.id)}
                                  className="text-xs hover:opacity-70 transition-opacity"
                                  style={{ color: t.error || "#F06070" }}
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="rounded-xl px-4 py-2 text-xs font-semibold border transition hover:bg-opacity-10"
                    style={{ borderColor: t.borderDefault, color: t.textPrimary, background: t.bgCard }}
                  >
                    + Add Line Item
                  </button>
                </div>

                {/* Assigned Vendors Sub-Box */}
                <div
                  className="rounded-3xl border p-6 space-y-4"
                  style={{ background: t.bgSurface, borderColor: t.borderDefault }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>
                    Assign Vendors
                  </div>

                  <div className="space-y-2">
                    {assignedVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex items-center justify-between p-3 rounded-xl border text-sm"
                        style={{ background: t.bgCard, borderColor: t.borderSubtle }}
                      >
                        <span className="font-medium" style={{ color: t.textPrimary }}>{vendor.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAssignedVendors(
                              assignedVendors.filter(
                                (item) => item.id !== vendor.id,
                              ),
                            )
                          }
                          className="text-xs font-bold px-1 hover:opacity-70 transition-opacity"
                          style={{ color: t.textMuted }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenVendorPicker}
                    disabled={usersLoading}
                    className="w-full rounded-xl py-3 text-xs font-semibold border border-dashed text-center transition hover:bg-opacity-10"
                    style={{ borderColor: t.borderDefault, color: t.textMuted, background: t.bgCard }}
                  >
                    {usersLoading
                      ? "Loading vendors..."
                      : "+ Add Vendor Partnership"}
                  </button>

                  {showVendorPicker ? (
                    <div
                      className="max-h-56 space-y-2 overflow-y-auto rounded-xl border p-2"
                      style={{
                        background: t.bgCard,
                        borderColor: t.borderDefault,
                      }}
                    >
                      {availableVendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          type="button"
                          onClick={() => handleAddVendor(vendor)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:opacity-80"
                          style={{ background: t.bgSurface }}
                        >
                          <span>
                            <span
                              className="block text-sm font-semibold"
                              style={{ color: t.textPrimary }}
                            >
                              {vendor.name}
                            </span>
                            <span
                              className="block text-xs"
                              style={{ color: t.textMuted }}
                            >
                              {vendor.email}
                            </span>
                          </span>
                          <span
                            className="text-xs font-bold"
                            style={{ color: t.accent }}
                          >
                            Add
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Bottom Section: Upload Block & Actions */}
            <div className="grid gap-6 lg:grid-cols-2 flex items-center justify-center">
              {/* Complete Submission System Buttons */}
              <div className="flex flex-col sm:flex-row lg:justify-end gap-3 sm:pt-24">
                <button
                  type="button"
                  onClick={() => handleSubmitRFQ("DRAFT")}
                  disabled={loadingStatus !== null}
                  className="rounded-xl px-6 py-3.5 text-sm font-semibold border order-2 sm:order-1 transition hover:opacity-80"
                  style={{ borderColor: t.borderDefault, color: t.textPrimary, background: t.bgCard }}
                >
                  {loadingStatus === "DRAFT" ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitRFQ("PENDING_APPROVAL")}
                  disabled={loadingStatus !== null}
                  className="rounded-xl px-6 py-3.5 text-sm font-semibold order-1 sm:order-2 transition hover:opacity-90 shadow-lg"
                  style={{ background: t.accent, color: t.textOnAccent || t.btnText }}
                >
                  {loadingStatus === "PENDING_APPROVAL"
                    ? "Sending..."
                    : "Save & Send to Vendors"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
