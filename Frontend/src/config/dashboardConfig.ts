export type RoleKey =
  | "admin"
  | "procurement_officer"
  | "vendor"
  | "manager";

export interface DashboardNavItem {
  label: string;
  path: string;
  icon: string;
}

export interface DashboardKpi {
  label: string;
  value: string;
  hint?: string;
}

export interface DashboardCard {
  title: string;
  subtitle: string;
  description: string;
}

export interface DashboardWidget {
  title: string;
  description: string;
  rows?: Array<{ label: string; value: string }>;
  highlight?: string;
}

export interface DashboardNotification {
  title: string;
  message: string;
  time: string;
}

export interface DashboardConfig {
  roleLabel: string;
  title: string;
  subtitle: string;
  sidebarItems: DashboardNavItem[];
  kpiCards: DashboardKpi[];
  chartCards: DashboardCard[];
  quickActions: Array<{ label: string; action: string }>;
  widgets: DashboardWidget[];
  notifications?: DashboardNotification[];
  emptyState?: string;
}

export const dashboardConfigs: Record<RoleKey, DashboardConfig> = {
  admin: {
    roleLabel: "Administrator",
    title: "Admin Dashboard",
    subtitle:
      "Run the VendorBridge platform, review adoption metrics, and manage users, vendors, and procurement workflows.",
    sidebarItems: [
      { label: "Dashboard", path: "/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
      { label: "User Management", path: "/user-management", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zm-9 8c0-3.866 3.134-7 7-7h4c3.866 0 7 3.134 7 7" },
      { label: "Vendor Management", path: "/vendors", icon: "M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM8 7H6c-1.105 0-2 .895-2 2v7h6v-7c0-1.105-.895-2-2-2zM8 16H2v1c0 1.105.895 2 2 2h4c1.105 0 2-.895 2-2v-1z" },
      { label: "RFQs", path: "/rfqs", icon: "M4 7h16M4 12h16M4 17h16" },
      { label: "Quotations", path: "/quotations", icon: "M9 12h6M9 16h6M12 4v16" },
      { label: "Approvals", path: "/approvals", icon: "M5 13l4 4L19 7" },
      { label: "Purchase Orders", path: "/purchase-orders", icon: "M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
      { label: "Invoices", path: "/invoices", icon: "M9 8h6M9 12h6M9 16h4M7 4h10l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" },
      { label: "Reports & Analytics", path: "/reports", icon: "M6 18V6m6 12V10m6 8V13" },
      { label: "Activity Logs", path: "/activity-logs", icon: "M12 8v8m4-4H8" },
      { label: "Settings", path: "/settings", icon: "M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" },
    ],
    kpiCards: [
      { label: "Total Users", value: "1,240", hint: "Active accounts" },
      { label: "Total Vendors", value: "387", hint: "Verified partners" },
      { label: "Active RFQs", value: "92", hint: "Open procurement" },
      { label: "Pending Approvals", value: "18", hint: "Awaiting review" },
      { label: "Purchase Orders", value: "324", hint: "Approved orders" },
      { label: "Total Invoices", value: "287", hint: "Processed invoices" },
      { label: "Procurement Value", value: "$8.3M", hint: "Current quarter" },
      { label: "Monthly Spend", value: "$1.4M", hint: "Budget utilization" },
    ],
    chartCards: [
      { title: "Procurement Spend Trend", subtitle: "Spend by week", description: "Monitor category spend and sourcing velocity." },
      { title: "Vendor Growth", subtitle: "New partners this quarter", description: "See vendor onboarding momentum across regions." },
      { title: "RFQ Status Distribution", subtitle: "Open vs awarded", description: "Review RFQ flow from issuance to award." },
    ],
    quickActions: [
      { label: "Add User", action: "add-user" },
      { label: "Add Vendor", action: "add-vendor" },
      { label: "View Reports", action: "view-reports" },
      { label: "Manage Settings", action: "manage-settings" },
    ],
    widgets: [
      { title: "Recent Activities", description: "System events, approvals and collaboration updates." },
      { title: "Top Vendors", description: "High-performing vendors with the best on-time delivery." },
      { title: "Pending Approvals", description: "Requests that require your review today." },
      { title: "Procurement Overview", description: "Executive summary of spend and team performance." },
    ],
  },
  procurement_officer: {
    roleLabel: "Procurement Officer",
    title: "Procurement Operations",
    subtitle:
      "Focus on RFQ performance, quotation comparisons, purchase order generation and spend efficiency.",
    sidebarItems: [
      { label: "Dashboard", path: "/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
      { label: "RFQs", path: "/rfqs", icon: "M4 7h16M4 12h16M4 17h16" },
      { label: "Quotations", path: "/quotations", icon: "M9 12h6M9 16h6M12 4v16" },
      { label: "Compare Quotations", path: "/compare-quotations", icon: "M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" },
      { label: "Purchase Orders", path: "/purchase-orders", icon: "M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
      { label: "Invoices", path: "/invoices", icon: "M9 8h6M9 12h6M9 16h4M7 4h10l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" },
      { label: "Vendors", path: "/vendors", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zm-9 8c0-3.866 3.134-7 7-7h4c3.866 0 7 3.134 7 7" },
      { label: "Reports", path: "/reports", icon: "M6 18V6m6 12V10m6 8V13" },
    ],
    kpiCards: [
      { label: "Active RFQs", value: "26", hint: "Currently in progress" },
      { label: "Pending Quotations", value: "14", hint: "Waiting responses" },
      { label: "Approved Quotations", value: "37", hint: "Accepted proposals" },
      { label: "POs Generated", value: "58", hint: "Issued this month" },
      { label: "Invoices Generated", value: "46", hint: "Ready for payment" },
      { label: "Monthly Spend", value: "$720K", hint: "Active procurement" },
    ],
    chartCards: [
      { title: "Procurement Funnel", subtitle: "Opportunity stages", description: "Track RFQ conversions from shortlist to award." },
      { title: "RFQ Progress", subtitle: "Cycle time", description: "Measure open, quoted and awarded requisitions." },
      { title: "Monthly Spend", subtitle: "Expenditure trend", description: "Compare committed spend against targets." },
    ],
    quickActions: [
      { label: "Create RFQ", action: "create-rfq" },
      { label: "Compare Quotations", action: "compare-quotations" },
      { label: "Generate PO", action: "generate-po" },
      { label: "Generate Invoice", action: "generate-invoice" },
    ],
    widgets: [
      { title: "Active RFQs", description: "Open requests with vendor engagement." },
      { title: "Pending Quotations", description: "Quotes requiring evaluation now." },
      { title: "Recent Purchase Orders", description: "Latest POs issued for approval." },
      { title: "Vendor Comparison", description: "Insight into pricing and delivery performance." },
    ],
  },
  vendor: {
    roleLabel: "Vendor",
    title: "Vendor Performance",
    subtitle:
      "Manage your RFQ assignments, respond to quotations, and monitor purchase order and payment activity.",
    sidebarItems: [
      { label: "Dashboard", path: "/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
      { label: "My RFQs", path: "/my-rfqs", icon: "M4 7h16M4 12h16M4 17h16" },
      { label: "My Quotations", path: "/my-quotations", icon: "M9 12h6M9 16h6M12 4v16" },
      { label: "Purchase Orders", path: "/purchase-orders", icon: "M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
      { label: "Payments", path: "/payments", icon: "M12 8v8m4-4H8" },
      { label: "Notifications", path: "/notifications", icon: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" },
      { label: "Profile", path: "/profile", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" },
    ],
    kpiCards: [
      { label: "Open RFQs", value: "11", hint: "Requests assigned to you" },
      { label: "Submitted Quotations", value: "28", hint: "Quotes sent" },
      { label: "Approved Quotations", value: "15", hint: "Accepted proposals" },
      { label: "POs Received", value: "19", hint: "Confirmed purchase orders" },
      { label: "Revenue Earned", value: "$320K", hint: "Confirmed deliveries" },
      { label: "Pending Payments", value: "7", hint: "Awaiting settlement" },
    ],
    chartCards: [
      { title: "Monthly Revenue", subtitle: "Sales and delivery", description: "Track order revenue and realized payments." },
      { title: "RFQ Participation", subtitle: "Response rate", description: "See your proposal submission activity." },
      { title: "Quotation Success Rate", subtitle: "Win ratio", description: "Compare submitted quotes vs accepted offers." },
    ],
    quickActions: [
      { label: "Submit Quotation", action: "submit-quotation" },
      { label: "View Purchase Orders", action: "view-pos" },
      { label: "Track RFQ Status", action: "track-rfq" },
    ],
    widgets: [
      { title: "Assigned RFQs", description: "RFQs that still need your response." },
      { title: "Submitted Quotations", description: "Recent proposals and response timelines." },
      { title: "Recent Purchase Orders", description: "New orders requiring fulfilment." },
      { title: "Payment Tracking", description: "Current payment status across invoices." },
    ],
    notifications: [
      { title: "New RFQ Assigned", message: "A new RFQ has been shared with your company.", time: "2m ago" },
      { title: "Quotation Approved", message: "Your quotation for PO-231 has been approved.", time: "1h ago" },
      { title: "PO Generated", message: "A new purchase order is ready for fulfilment.", time: "4h ago" },
    ],
  },
  manager: {
    roleLabel: "Manager",
    title: "Approval Performance",
    subtitle:
      "Oversee approvals, procurement requests, risk, and audit insights with clear decision support.",
    sidebarItems: [
      { label: "Dashboard", path: "/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
      { label: "Approvals", path: "/approvals", icon: "M5 13l4 4L19 7" },
      { label: "Procurement Requests", path: "/procurement-requests", icon: "M12 4v16M4 12h16" },
      { label: "Purchase Orders", path: "/purchase-orders", icon: "M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
      { label: "Audit Logs", path: "/audit-logs", icon: "M12 8v8m4-4H8" },
      { label: "Reports", path: "/reports", icon: "M6 18V6m6 12V10m6 8V13" },
    ],
    kpiCards: [
      { label: "Pending Approvals", value: "12", hint: "Action required" },
      { label: "Approved Requests", value: "46", hint: "Completed this week" },
      { label: "Rejected Requests", value: "7", hint: "Declined requests" },
      { label: "Value Awaiting Approval", value: "$1.1M", hint: "High priority spend" },
    ],
    chartCards: [
      { title: "Approval Trends", subtitle: "Decisions over time", description: "Track approval volume and decision speed." },
      { title: "Approval Time Analytics", subtitle: "Response latency", description: "Measure cycle time for approvals and escalations." },
      { title: "Procurement Risk Analysis", subtitle: "Value at risk", description: "See budget, supplier and compliance alerts." },
    ],
    quickActions: [
      { label: "Approve Request", action: "approve-request" },
      { label: "Reject Request", action: "reject-request" },
      { label: "View Audit Trail", action: "view-audit-trail" },
    ],
    widgets: [
      { title: "Approval Queue", description: "Requests waiting for your decision." },
      { title: "High Value Requests", description: "Large spend opportunities pending review." },
      { title: "Budget Alerts", description: "Spending approaching defined thresholds." },
      { title: "Approval Timeline", description: "Latest approvals and escalation status." },
    ],
    notifications: [
      { title: "Budget Exceeded", message: "Request P-112 exceeded the approved limit.", time: "10m ago" },
      { title: "Vendor Rating Alert", message: "A supplier dropped below required rating.", time: "1h ago" },
    ],
  },
};
