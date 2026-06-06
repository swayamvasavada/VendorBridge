import { useState, useMemo } from "react";
import { tokens, Theme } from "../colors/color";
import Sidebar from "../components/Sidebar";
import { dashboardConfigs, RoleKey } from "../config/dashboardConfig";
import { useAuthStore } from "../store/authStore";

interface Vendor {
  id: number;
  name: string;
  category: string;
  gst: string;
  contact: string;
  status: string;
  address: string;
}

const initialVendors: Vendor[] = [
  {
    id: 1,
    name: "Infra Supplies Pvt Ltd",
    category: "Construction",
    gst: "27AABCS1429B2O",
    contact: "+91 9876543210",
    status: "Active",
    address: "Plot No. 45, GIDC Industrial Estate, Sector 26, Gandhinagar, Gujarat - 382024",
  },
  {
    id: 2,
    name: "Tech Core LTD",
    category: "IT",
    gst: "27AAICT1234A1Z5",
    contact: "+91 9988776655",
    status: "Active",
    address: "Building 10B, 4th Floor, Cyber City, DLF Phase 3, Gurugram, Haryana - 122002",
  },
  {
    id: 3,
    name: "FastLog Transport",
    category: "Logistics",
    gst: "27AABCF5678K1Z2",
    contact: "+91 9123456789",
    status: "Blocked",
    address: "Survey No. 112/2, Near Nh-8 Highway, Aslali Bypass, Ahmedabad, Gujarat - 382427",
  },
];

export default function VendorPage() {
  const theme: Theme = "dark"; // Or hook it to the theme state if you build theme-switching later
  const t = tokens(theme);

  // Grab the same authenticated user context as the Dashboard
  const user = useAuthStore((state) => state.user);

  // Compute the dynamic configuration matching the sidebar navigation
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

  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "Construction",
    gst: "",
    contact: "",
    status: "Active",
    address: "",
  });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.gst || !newVendor.contact || !newVendor.address) return;

    const vendorToAdd: Vendor = {
      id: Date.now(),
      ...newVendor,
    };

    setVendors([vendorToAdd, ...vendors]);
    setIsAddModalOpen(false);

    setNewVendor({
      name: "",
      category: "Construction",
      gst: "",
      contact: "",
      status: "Active",
      address: "",
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.gst.toLowerCase().includes(search.toLowerCase()) ||
      vendor.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = activeFilter === "All" || vendor.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
        {/* Layout Grid wrapping sidebar and contents cleanly */}
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          
          {/* Synchronized Sidebar component feeding data dynamically */}
          <Sidebar t={t} navItems={dashboard.sidebarItems} />

          <main className="space-y-6 min-w-0 w-full">
            {/* Header */}
            <section
              className="rounded-[28px] border p-6"
              style={{
                background: t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div
                    className="text-sm uppercase tracking-[0.25em] font-semibold"
                    style={{ color: t.textLabel }}
                  >
                    VendorBridge • {dashboard.roleLabel}
                  </div>
                  <h1 className="mt-3 text-3xl font-black" style={{ color: t.textPrimary }}>
                    Vendors
                  </h1>
                  <p className="mt-2 text-sm" style={{ color: t.textMuted }}>
                    Manage supplier profiles and registrations
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    background: t.accent,
                    color: t.textOnAccent,
                  }}
                >
                  + Add Vendor
                </button>
              </div>
            </section>

            {/* Search */}
            <section
              className="rounded-3xl border p-5 flex items-center gap-3 transition-all"
              style={{
                background: t.bgInput || t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by vendor name, GST number, category..."
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: t.textPrimary }}
              />
            </section>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {["All", "Active", "Pending", "Blocked"].map((item) => {
                const isSelected = activeFilter === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    className="rounded-full px-5 py-2 text-sm font-semibold transition"
                    style={{
                      background: isSelected ? t.accent : t.bgCard,
                      color: isSelected ? t.textOnAccent : t.textPrimary,
                      border: `1px solid ${isSelected ? t.accent : t.borderDefault}`,
                      cursor: "pointer"
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Vendor Table */}
            <section
              className="rounded-[28px] border p-6 overflow-x-auto"
              style={{
                background: t.bgSurface,
                borderColor: t.borderDefault,
              }}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider font-bold" style={{ borderColor: t.borderDefault, color: t.textLabel }}>
                    <th className="text-left py-4 px-2">Vendor Name</th>
                    <th className="text-left py-4 px-2">Category</th>
                    <th className="text-left py-4 px-2">GST No.</th>
                    <th className="text-left py-4 px-2">Contact</th>
                    <th className="text-left py-4 px-2">Status</th>
                    <th className="text-left py-4 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b last:border-b-0 transition-colors" style={{ borderColor: t.borderSubtle }}>
                        <td className="py-4 px-2 font-medium">{vendor.name}</td>
                        <td className="py-4 px-2" style={{ color: t.textMuted }}>{vendor.category}</td>
                        <td className="py-4 px-2 font-mono text-xs">{vendor.gst}</td>
                        <td className="py-4 px-2" style={{ color: t.textMuted }}>{vendor.contact}</td>
                        <td className="py-4 px-2">
                          <span
                            className="rounded-full px-3 py-1 text-xs font-bold inline-block"
                            style={{
                              background: vendor.status === "Active" ? t.accentSubtle : vendor.status === "Blocked" ? "rgba(240, 96, 112, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: vendor.status === "Active" ? t.accent : vendor.status === "Blocked" ? "#F06070" : "#F59E0B",
                            }}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-opacity-80"
                            style={{ background: t.bgCard, border: `1px solid ${t.borderDefault}`, color: t.textPrimary, cursor: "pointer" }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10" style={{ color: t.textMuted }}>
                        No vendors found matching your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>

      {/* --- ADD VENDOR MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border p-6 space-y-6 shadow-2xl" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black" style={{ color: t.textPrimary }}>Add New Vendor</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-lg font-bold p-1 hover:opacity-70" style={{ color: t.textMuted }}>✕</button>
            </div>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Vendor Name</label>
                <input type="text" required value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} placeholder="e.g. Acme Corp Industries" className="rounded-xl border p-3 text-sm bg-transparent outline-none" style={{ borderColor: t.borderSubtle, color: t.textPrimary }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Category</label>
                  <select value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} className="rounded-xl border p-3 text-sm bg-transparent outline-none" style={{ borderColor: t.borderSubtle, color: t.textPrimary, background: t.bgSurface }}>
                    <option value="Construction">Construction</option>
                    <option value="IT">IT</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>GST Number</label>
                  <input type="text" required value={newVendor.gst} onChange={(e) => setNewVendor({ ...newVendor, gst: e.target.value })} placeholder="e.g. 27AAICT1234A1Z5" className="rounded-xl border p-3 text-sm bg-transparent outline-none" style={{ borderColor: t.borderSubtle, color: t.textPrimary }} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Contact</label>
                <input type="text" required value={newVendor.contact} onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })} placeholder="e.g. +91 9876543210" className="rounded-xl border p-3 text-sm bg-transparent outline-none" style={{ borderColor: t.borderSubtle, color: t.textPrimary }} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Address</label>
                <textarea required rows={3} value={newVendor.address} onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} placeholder="Complete street address..." className="rounded-xl border p-3 text-sm bg-transparent outline-none resize-none" style={{ borderColor: t.borderSubtle, color: t.textPrimary }} />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl border px-5 py-3 text-sm font-semibold transition" style={{ borderColor: t.borderDefault, color: t.textPrimary }}>Cancel</button>
                <button type="submit" className="rounded-xl px-5 py-3 text-sm font-semibold transition" style={{ background: t.accent, color: t.textOnAccent }}>Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VENDOR DETAIL MODAL --- */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border p-6 space-y-6 shadow-2xl" style={{ background: t.bgSurface, borderColor: t.borderDefault }}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black" style={{ color: t.textPrimary }}>Vendor Information</h2>
              <button onClick={() => setSelectedVendor(null)} className="text-lg font-bold p-1 hover:opacity-70" style={{ color: t.textMuted }}>✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Company Name</p>
                <p className="text-base font-semibold mt-1" style={{ color: t.textPrimary }}>{selectedVendor.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Category</p>
                  <p className="text-sm mt-1" style={{ color: t.textMuted }}>{selectedVendor.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Status</p>
                  <span className="rounded-full px-3 py-0.5 text-xs font-bold inline-block mt-1" style={{ background: selectedVendor.status === "Active" ? t.accentSubtle : "rgba(240, 96, 112, 0.15)", color: selectedVendor.status === "Active" ? t.accent : "#F06070" }}>
                    {selectedVendor.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>GSTIN</p>
                  <p className="text-sm font-mono mt-1" style={{ color: t.textPrimary }}>{selectedVendor.gst}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Contact Phone</p>
                  <p className="text-sm mt-1" style={{ color: t.textMuted }}>{selectedVendor.contact}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textLabel }}>Registered Address</p>
                <p className="text-sm leading-6 mt-1" style={{ color: t.textMuted }}>{selectedVendor.address}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedVendor(null)} className="rounded-xl px-5 py-3 text-sm font-semibold transition" style={{ background: t.bgCard, border: `1px solid ${t.borderDefault}`, color: t.textPrimary }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}