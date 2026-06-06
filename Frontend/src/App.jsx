import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgotPassword";

function AppContent() {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "14px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.25)",
          },

          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #10B981",
            },
          },

          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #EF4444",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors" element={<Dashboard />} />
        <Route path="/rfqs" element={<Dashboard />} />
        <Route path="/quotations" element={<Dashboard />} />
        <Route path="/approvals" element={<Dashboard />} />
        <Route path="/purchase-orders" element={<Dashboard />} />
        <Route path="/invoices" element={<Dashboard />} />
        <Route path="/reports" element={<Dashboard />} />
        <Route path="/activity" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;