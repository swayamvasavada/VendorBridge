// ForgotPassword.tsx — ProcureOS Forgot Password Screen
// Uses color tokens from colors.ts. Theme-aware with email reset flow.

import { useState, ChangeEvent, ReactNode } from "react";
import { tokens, ColorTokens, Theme } from "../colors/color";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormFields {
  email: string;
}

interface FormErrors {
  email?: string;
}

// ─── Shared icon helpers ──────────────────────────────────────────────────────
const MailIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ArrowLeftIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
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

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(email: string): FormErrors {
  const errors: FormErrors = {};
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Field wrapper
function Field({
  label, error, children, t,
}: {
  label: string; error?: string; children: ReactNode; t: ColorTokens;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: error ? t.error : t.textLabel }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="text-xs flex items-center gap-1" style={{ color: t.error }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

// Text input
function TextInput({
  type = "text", value, onChange, placeholder, t,
  icon, hasError,
}: {
  type?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; t: ColorTokens; icon?: ReactNode; hasError?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hasError ? t.error : focused ? t.borderFocus : hovered ? t.borderStrong : t.borderDefault;
  const bg          = focused || hovered ? t.bgInputHover : t.bgInput;
  const boxShadow   = focused ? `0 0 0 3px ${t.accentGlow}` : "none";

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex">
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
        className="w-full px-3.5 py-3 rounded-xl text-sm font-medium outline-none transition-all"
        style={{
          paddingLeft: icon ? "38px" : "14px",
          background: bg,
          borderWidth: "1.5px",
          borderColor: borderColor,
          color: t.textPrimary,
          boxShadow,
        }}
      />
    </div>
  );
}

// Email sent confirmation screen
function EmailSentScreen({ t, onBack }: { t: ColorTokens; onBack: () => void }) {
  return (
    <div className="text-center py-16 px-5">
      <div
        className="w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-5 border-1.5"
        style={{
          background: t.accentSubtle,
          borderColor: t.accent,
        }}
      >
        <CheckIcon color={t.accent} size={30}/>
      </div>
      <h2 className="text-2xl font-black mb-2" style={{ color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}>
        Check Your Email
      </h2>
      <p className="text-sm leading-relaxed mb-7" style={{ color: t.textMuted }}>
        We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
      </p>
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 mx-auto"
        style={{
          background: t.btnBg,
          color: t.btnText,
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <ArrowLeftIcon color={t.btnText}/> Back to Sign In
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = tokens(theme);

  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const errs = validate(email);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setEmail("");
    setErrors({});
    setSubmitted(false);
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
    <div
      className="min-h-screen flex items-center justify-center p-5 md:p-10"
      style={{
        background: t.bgPage,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-2xl rounded-3xl p-6 md:p-11 relative overflow-hidden"
        style={{
          background: t.bgSurface,
          border: `1px solid ${t.borderDefault}`,
          boxShadow: t.shadow,
        }}
      >
        {/* Ambient glow top-right */}
        <div
          className="absolute -top-28 -right-28 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{
            background: t.accentSubtle,
          }}
        />

        {/* ── Brand row ── */}
        <div className="flex items-center justify-between mb-10 relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: t.accent }}>
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
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            style={{
              background: t.bgCard,
              borderWidth: "1.5px",
              borderColor: t.borderStrong,
              color: t.textMuted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {theme === "dark" ? <SunIcon color={t.textMuted}/> : <MoonIcon color={t.textMuted}/>}
            <span className="hidden xs:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>

        {submitted ? (
          <EmailSentScreen t={t} onBack={handleBack}/>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-black mb-2" style={{ color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}>Forgot Password?</h1>
            <p className="text-sm mb-8" style={{ color: t.textMuted }}>Enter your email address and we'll send you a link to reset your password.</p>

            {/* Email field */}
            <div className="mb-6">
              <Field label="Email Address" error={errors.email} t={t}>
                <TextInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  placeholder="you@company.com"
                  t={t}
                  icon={<MailIcon color={t.textMuted}/>}
                  hasError={!!errors.email}
                />
              </Field>
            </div>

            {/* Send button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl text-base font-bold transition-all hover:scale-105 focus:outline-none"
              style={{
                background: t.btnBg,
                color: t.btnText,
                fontFamily: "'Sora', sans-serif",
                letterSpacing: "-0.01em",
                boxShadow: `0 4px 16px ${t.accentGlow}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnHover; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnBg; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              Send Reset Link
            </button>

            <p className="text-center mt-5 text-sm" style={{ color: t.textMuted }}>
              Remember your password?{" "}
              <span style={{ color: t.accent, fontWeight: 600, cursor: "pointer" }}>Sign in</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
