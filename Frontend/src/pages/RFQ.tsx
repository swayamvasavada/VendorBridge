import { useState, useMemo } from "react";
import { tokens, Theme } from "../colors/color";
import Sidebar from "../components/Sidebar";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";

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
  const [deadline, setDeadline] = useState("2025-06-15");
  const [description, setDescription] = useState("Ergonomic chairs and standing desks for 3rd floor");

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, item: "Ergonomic chair", qty: 25, unit: "NOS" },
    { id: 2, item: "Standing desks", qty: 10, unit: "NOS" },
  ]);

  // Assigned Vendors State
  const [assignedVendors, setAssignedVendors] = useState<string[]>([
    "Infra Supplies Pvt Ltd",
    "Tech Core LTD",
  ]);

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

  // Mock function to add a vendor partner
  const handleAddVendor = () => {
    const mockVendors = ["Apex Logistics", "Global Trading Corp", "Nexus Industries", "Vertex Solutions"];
    const available = mockVendors.filter(v => !assignedVendors.includes(v));
    if (available.length > 0) {
      setAssignedVendors([...assignedVendors, available[0]]);
    } else {
      alert("All sample vendor partnerships have been added.");
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
                    {assignedVendors.map((vendor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border text-sm"
                        style={{ background: t.bgCard, borderColor: t.borderSubtle }}
                      >
                        <span className="font-medium" style={{ color: t.textPrimary }}>{vendor}</span>
                        <button
                          type="button"
                          onClick={() => setAssignedVendors(assignedVendors.filter((v) => v !== vendor))}
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
                    onClick={handleAddVendor}
                    className="w-full rounded-xl py-3 text-xs font-semibold border border-dashed text-center transition hover:bg-opacity-10"
                    style={{ borderColor: t.borderDefault, color: t.textMuted, background: t.bgCard }}
                  >
                    + Add Vendor Partnership
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Upload Block & Actions */}
            <div className="grid gap-6 lg:grid-cols-2 flex items-center justify-center">
              {/* Complete Submission System Buttons */}
              <div className="flex flex-col sm:flex-row lg:justify-end gap-3 sm:pt-24">
                <button
                  type="button"
                  className="rounded-xl px-6 py-3.5 text-sm font-semibold border order-2 sm:order-1 transition hover:opacity-80"
                  style={{ borderColor: t.borderDefault, color: t.textPrimary, background: t.bgCard }}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="rounded-xl px-6 py-3.5 text-sm font-semibold order-1 sm:order-2 transition hover:opacity-90 shadow-lg"
                  style={{ background: t.accent, color: t.textOnAccent || t.btnText }}
                >
                  Save & Send to Vendors
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
