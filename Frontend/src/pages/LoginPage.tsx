// LoginPage.tsx — ProcureOS Sign In Screen
// Uses color tokens from colors.ts. All styles are inline via the `t` token object.

import { useState, ChangeEvent, CSSProperties, ReactNode } from "react";
import { tokens, ColorTokens, Theme } from "../colors/color";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Fields {
  email:    string;
  password: string;
  rememberMe: boolean;
}

interface Errors {
  email?:    string;
  password?: string;
}

const EMPTY_FIELDS: Fields = {
  email: "", password: "", rememberMe: false,
};

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.email.trim()) {
    e.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    e.email = "Enter a valid email";
  }
  if (!f.password) {
    e.password = "Password is required";
  }
  return e;
}

// ─── Shared icon helpers ──────────────────────────────────────────────────────
const MailIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const EyeOpen = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeSlash = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const CheckIcon = ({ color, size = 12 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SunIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({
  label, error, children, t,
}: {
  label: string; error?: string; children: ReactNode; t: ColorTokens;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11.5, fontWeight: 600, color: error ? t.error : t.textLabel, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "inherit" }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 11.5, color: t.error, display: "flex", alignItems: "center", gap: 4 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

function TextInput({
  type = "text", value, onChange, placeholder, t,
  icon, rightEl, hasError,
}: {
  type?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; t: ColorTokens; icon?: ReactNode; rightEl?: ReactNode; hasError?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hasError ? t.error : focused ? t.borderFocus : hovered ? t.borderStrong : t.borderDefault;
  const bg          = focused || hovered ? t.bgInputHover : t.bgInput;
  const boxShadow   = focused ? `0 0 0 3px ${t.accentGlow}` : "none";

  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: `13px ${rightEl ? "40px" : "14px"} 13px ${icon ? "38px" : "14px"}`,
          background: bg,
          border: `1.5px solid ${borderColor}`,
          borderRadius: 10,
          color: t.textPrimary,
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          transition: "all 0.2s",
          boxShadow,
        }}
      />
      {rightEl && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          {rightEl}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = tokens(theme);

  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [showPwd, setShowPwd] = useState(false);

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFields(f => ({ ...f, [key]: val }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const handleLogin = () => {
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      console.log("Logging in with standard credentials...", fields);
    }
  };

  // ── Google font injection ──
  if (typeof document !== "undefined") {
    if (!document.getElementById("procure-fonts")) {
      const link = document.createElement("link");
      link.id   = "procure-fonts";
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap";
      document.head.appendChild(link);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bgPage,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 480, // slightly narrower container suitable for compact login pages
        background: t.bgSurface,
        border: `1px solid ${t.borderDefault}`,
        borderRadius: 20,
        padding: "40px 44px 36px",
        boxShadow: t.shadow,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glow top-right */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 280, height: 280,
          background: t.accentSubtle,
          borderRadius: "50%", filter: "blur(60px)",
          pointerEvents: "none",
        }}/>

        {/* ── Brand row ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom:36, position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.btnText} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
           <div>
              <div className="text-sm md:text-base font-bold" style={{ color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}>VendorBridge</div>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(th => th === "dark" ? "light" : "dark")}
            style={{
              background: t.bgCard, border: `1.5px solid ${t.borderStrong}`,
              borderRadius: 8, padding: "7px 13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: t.textMuted, fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {theme === "dark" ? <SunIcon color={t.textMuted}/> : <MoonIcon color={t.textMuted}/>}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {/* Header Heading text */}
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>Welcome Back</h1>
        <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 28 }}>Sign in to access your vendor portal dashboard</p>

        {/* Input Details Block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 20 }}>
          {/* Email Address Field */}
          <Field label="Email Address" error={errors.email} t={t}>
            <TextInput type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" t={t}
              icon={<MailIcon color={t.textMuted}/>} hasError={!!errors.email}/>
          </Field>

          {/* Password Field */}
          <Field label="Password" error={errors.password} t={t}>
            <TextInput
              type={showPwd ? "text" : "password"}
              value={fields.password} onChange={set("password")}
              placeholder="Enter your password" t={t} hasError={!!errors.password}
              rightEl={
                <button onClick={() => setShowPwd(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, display: "flex", padding: 2 }}>
                  {showPwd ? <EyeSlash color={t.textMuted}/> : <EyeOpen color={t.textMuted}/>}
                </button>
              }
            />
          </Field>
        </div>

        {/* Action Controls Footer Row (Remember me + Forgot password link) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={() => setFields(f => ({ ...f, rememberMe: !f.rememberMe }))}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              background: fields.rememberMe ? t.accent : t.bgCard,
              border: `1.5px solid ${fields.rememberMe ? t.accent : t.borderStrong}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {fields.rememberMe && <CheckIcon color={t.checkmark} size={9}/>}
            </div>
            <span style={{ fontSize: 13, color: t.textMuted, userSelect: "none" }}>Remember me</span>
          </div>

          <span style={{ fontSize: 13, color: t.accent, fontWeight: 600, cursor: "pointer" }}>
            Forgot password?
          </span>
        </div>

        {/* Login Submission Trigger Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "15px",
            background: t.btnBg, color: t.btnText,
            border: "none", borderRadius: 11,
            fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif",
            cursor: "pointer", letterSpacing: "-0.01em",
            boxShadow: `0 4px 16px ${t.accentGlow}`,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnHover; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnBg; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          Sign In →
        </button>

        {/* Screen Routing Switch Link Footer */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13.5, color: t.textMuted }}>
          Don't have an account?{" "}
                  <Link
                      to="/signup"
                      style={{
                          color: t.accent,
                          fontWeight: 600,
                          textDecoration: "none",
                          cursor: "pointer",
                      }}
                  >
                      Sign up
                  </Link>
        </p>
      </div>
    </div>
  );
}