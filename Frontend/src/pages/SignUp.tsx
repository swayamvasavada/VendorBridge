// SignUpPage.tsx — ProcureOS Registration Screen 2
// Uses color tokens from colors.ts. All styles are inline via the `t` token object.

import { useState, ChangeEvent, ReactNode } from "react";
import { tokens, ColorTokens, Theme } from "../colors/color";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Fields {
  firstName:       string;
  lastName:        string;
  email:           string;
  phone:           string;
  role:            string;
  country:         string;
  additionalInfo:  string;
  password:        string;
  confirmPassword: string;
  agreed:          boolean;
}

interface Errors {
  firstName?:       string;
  lastName?:        string;
  email?:           string;
  phone?:           string;
  role?:            string;
  country?:         string;
  password?:        string;
  confirmPassword?: string;
  agreed?:          string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES    = ["Admin","Procurement Officer","Vendor","Manager"];

const EMPTY_FIELDS: Fields = {
  firstName:"", lastName:"", email:"", phone:"", role:"", country:"",
  additionalInfo:"", password:"", confirmPassword:"", agreed:false,
};

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.firstName.trim())       e.firstName       = "First name is required";
  if (!f.lastName.trim())        e.lastName        = "Last name is required";
  if (!f.email.trim())           e.email           = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
  if (!f.phone.trim())           e.phone           = "Phone number is required";
  if (!f.role)                   e.role            = "Select a role";
  if (!f.country)                e.country         = "Select a country";
  if (!f.password)               e.password        = "Password is required";
  else if (f.password.length < 8) e.password       = "Minimum 8 characters";
  if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords don't match";
  if (!f.agreed)                 e.agreed          = "You must accept the terms";
  return e;
}

// ─── Password strength ────────────────────────────────────────────────────────
function pwdStrength(p: string): { score: number; color: string; label: string } {
  if (!p) return { score: 0, color: "transparent", label: "" };
  const checks = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)];
  const score   = checks.filter(Boolean).length;
  const data = ["", "#F06070", "#FFBF40", "#FFBF40", "#3DD68C"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, color: data[score], label: labels[score] };
}

// ─── Shared icon helpers ──────────────────────────────────────────────────────
const UserIcon = ({ color }: { color: string }) => (
  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12.3a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6z"/>
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
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

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
          paddingRight: rightEl ? "40px" : "14px",
          background: bg,
          borderWidth: "1.5px",
          borderColor: borderColor,
          color: t.textPrimary,
          boxShadow,
        }}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex">
          {rightEl}
        </div>
      )}
    </div>
  );
}

// Select input
function SelectInput({
  value, onChange, options, placeholder, t, hasError,
}: {
  value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; placeholder: string; t: ColorTokens; hasError?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hasError ? t.error : focused ? t.borderFocus : hovered ? t.borderStrong : t.borderDefault;
  const bg          = focused || hovered ? t.bgInputHover : t.bgInput;
  const boxShadow   = focused ? `0 0 0 3px ${t.accentGlow}` : "none";

  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full px-3 py-3 rounded-xl text-sm font-medium outline-none transition-all cursor-pointer appearance-none"
      style={{
        paddingRight: "36px",
        background: bg,
        borderWidth: "1.5px",
        borderColor: borderColor,
        color: value ? t.textPrimary : t.textMuted,
        boxShadow,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A8BAA' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 13px center",
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// Password strength bar
function StrengthBar({ password, t }: { password: string; t: ColorTokens }) {
  const { score, color, label } = pwdStrength(password);
  if (!password) return null;
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-0.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-0.5 rounded transition-colors" style={{ background: i <= score ? color : t.borderStrong }}/>
        ))}
      </div>
      {label && <span className="text-xs font-semibold" style={{ color }}>{label}</span>}
    </div>
  );
}

// Avatar display with initials
function AvatarDisplay({ firstName, lastName, t }: { firstName: string; lastName: string; t: ColorTokens }) {
  const hasName = firstName.trim() && lastName.trim();
  const initials = hasName ? `${firstName.trim()[0]}${lastName.trim()[0]}`.toUpperCase() : "";

  return (
    <div className="flex justify-center mb-6">
      <div
        className="w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all"
        style={{
          borderColor: t.borderStrong,
          background: hasName ? t.accentSubtle : t.bgCard,
          borderStyle: hasName ? "solid" : "dashed",
        }}
      >
        {hasName ? (
          <span
            className="text-2xl font-bold"
            style={{
              color: t.accent,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {initials}
          </span>
        ) : (
          <UserIcon color={t.textMuted}/>
        )}
      </div>
    </div>
  );
}

// Success screen
function SuccessScreen({ t, onBack }: { t: ColorTokens; onBack: () => void }) {
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
        Registration Submitted!
      </h2>
      <p className="text-sm leading-relaxed mb-7" style={{ color: t.textMuted }}>
        Your account request is pending approval.<br/>
        Check your email for a confirmation link.
      </p>
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: t.btnBg,
          color: t.btnText,
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Back to Sign Up
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SignUpPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = tokens(theme);

  const [fields, setFields]       = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors]       = useState<Errors>({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showCPwd, setShowCPwd]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFields(f => ({ ...f, [key]: val }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const resetForm = () => {
    setFields(EMPTY_FIELDS);
    setErrors({});
    setSubmitted(false);
  };

  // ── Shared input style helpers ──
  const row2 = "grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5";

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
      className="min-h-screen flex items-start justify-center p-5 md:p-10"
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
          <SuccessScreen t={t} onBack={resetForm}/>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-black mb-8 flex flex-col items-center justify-center" style={{ color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}>Registration</h1>

            {/* Avatar display */}
            <AvatarDisplay firstName={fields.firstName} lastName={fields.lastName} t={t}/>


            {/* Row 1: First + Last Name */}
            <div className={row2}>
              <Field label="First Name" error={errors.firstName} t={t}>
                <TextInput value={fields.firstName} onChange={set("firstName")} placeholder="e.g. Pushkar" t={t}
                  icon={<UserIcon color={t.textMuted}/>} hasError={!!errors.firstName}/>
              </Field>
              <Field label="Last Name" error={errors.lastName} t={t}>
                <TextInput value={fields.lastName} onChange={set("lastName")} placeholder="e.g. Shinde" t={t} hasError={!!errors.lastName}/>
              </Field>
            </div>

            {/* Row 2: Email + Phone */}
            <div className={row2}>
              <Field label="Email Address" error={errors.email} t={t}>
                <TextInput type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" t={t}
                  icon={<MailIcon color={t.textMuted}/>} hasError={!!errors.email}/>
              </Field>
              <Field label="Phone Number" error={errors.phone} t={t}>
                <TextInput type="tel" value={fields.phone} onChange={set("phone")} placeholder="+91 98765 43210" t={t}
                  icon={<PhoneIcon color={t.textMuted}/>} hasError={!!errors.phone}/>
              </Field>
            </div>

            {/* Row 3: Role + Country */}
            <div className={row2}>
              <Field label="Role (Admin, Officer)" error={errors.role} t={t}>
                <SelectInput value={fields.role} onChange={set("role")} options={ROLES} placeholder="Select role…" t={t} hasError={!!errors.role}/>
              </Field>
              <Field label="Country" error={errors.country} t={t}>
                <TextInput value={fields.country} onChange={set("country")} placeholder="e.g. India" t={t} hasError={!!errors.country}/>
              </Field>
            </div>

            {/* Additional info */}
            <div className="mb-3.5">
              <Field label="Additional Information" t={t}>
                <textarea
                  value={fields.additionalInfo}
                  onChange={set("additionalInfo")}
                  placeholder="Department, vendor categories you manage, any relevant details…"
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    background: t.bgInput,
                    borderWidth: "1.5px",
                    borderColor: t.borderDefault,
                    color: t.textPrimary,
                    lineHeight: "1.6",
                  }}
                />
              </Field>
            </div>

            {/* Row 4: Password + Confirm */}
            <div className={row2 + " mb-1"}>
              <Field label="Password" error={errors.password} t={t}>
                <TextInput
                  type={showPwd ? "text" : "password"}
                  value={fields.password} onChange={set("password")}
                  placeholder="Min. 8 characters" t={t} hasError={!!errors.password}
                  rightEl={
                    <button onClick={() => setShowPwd(v => !v)} className="bg-none border-none cursor-pointer flex p-0.5" style={{ color: t.textMuted }}>
                      {showPwd ? <EyeSlash color={t.textMuted}/> : <EyeOpen color={t.textMuted}/>}
                    </button>
                  }
                />
                <StrengthBar password={fields.password} t={t}/>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword} t={t}>
                <TextInput
                  type={showCPwd ? "text" : "password"}
                  value={fields.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="Re-enter password" t={t} hasError={!!errors.confirmPassword}
                  rightEl={
                    <button onClick={() => setShowCPwd(v => !v)} className="bg-none border-none cursor-pointer flex p-0.5" style={{ color: t.textMuted }}>
                      {showCPwd ? <EyeSlash color={t.textMuted}/> : <EyeOpen color={t.textMuted}/>}
                    </button>
                  }
                />
              </Field>
            </div>

            {/* Terms checkbox */}
            <div
              className="flex items-start gap-2.5 my-4.5 cursor-pointer"
              onClick={() => { setFields(f => ({ ...f, agreed: !f.agreed })); setErrors(e => ({ ...e, agreed: undefined })); }}
            >
              <div
                className="w-4.5 h-4.5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                style={{
                  background: fields.agreed ? t.accent : t.bgCard,
                  borderWidth: "1.5px",
                  borderColor: errors.agreed ? t.error : fields.agreed ? t.accent : t.borderStrong,
                }}
              >
                {fields.agreed && <CheckIcon color={t.checkmark} size={10}/>}
              </div>
              <span className="text-sm leading-1.55" style={{ color: t.textMuted }}>
                I agree to the{" "}
                <span style={{ color: t.accent, fontWeight: 600 }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color: t.accent, fontWeight: 600 }}>Privacy Policy</span>.
                {" "}Data is handled securely per procurement compliance standards.
              </span>
            </div>
            {errors.agreed && <p className="text-xs mb-2.5" style={{ color: t.error }}>⚠ {errors.agreed}</p>}

            {/* Register button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-3.5 rounded-xl text-base font-bold transition-all hover:scale-105 focus:outline-none"
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
              Register →
            </button>

            <p className="text-center mt-3.5 text-sm" style={{ color: t.textMuted }}>
              Already have an account?{" "}
              <Link
                to="/"
                style={{
                  color: t.accent,
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}