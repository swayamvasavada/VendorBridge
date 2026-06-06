import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
// import ForgetPassword from "./pages/ForgetPassword";
import ForgetPassword from "./pages/ForgotPassword";

function AppContent() {
  return (
    <>
      {/* <div className="flex min-h-screen"> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
      {/* </div> */}
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
