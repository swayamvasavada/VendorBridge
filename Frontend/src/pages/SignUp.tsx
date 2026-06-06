// SignUpPage.tsx — ProcureOS Registration Screen 2
// Uses color tokens from colors.ts. All styles are inline via the `t` token object.

import { useState, useRef, ChangeEvent, CSSProperties, ReactNode } from "react";
import { tokens, ColorTokens, Theme } from "../colors/color";

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
const ROLES    = ["Admin","Procurement Officer","Vendor Manager","Finance Officer","Auditor","Viewer"];
const COUNTRIES = ["India","United States","United Kingdom","Germany","UAE","Singapore","Australia","Canada","France","Japan"];

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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// Stepper
function Stepper({ step, t }: { step: number; t: ColorTokens }) {
  const steps = ["Account", "Profile", "Verify"];
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {steps.map((label, i) => {
        const idx   = i + 1;
        const done  = step > idx;
        const active = step === idx;
        return (
          <div key={label} style={{ display:"flex", alignItems:"center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                background: done || active ? t.accent : t.bgCard,
                border: `1.5px solid ${done || active ? t.accent : t.borderStrong}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.3s",
                color: done || active ? t.btnText : t.textMuted,
                fontSize:12, fontWeight:700,
              }}>
                {done ? <CheckIcon color={t.btnText} size={12}/> : idx}
              </div>
              <span style={{ fontSize:11, fontWeight:600, color: active ? t.accent : t.textMuted, whiteSpace:"nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex:1, height:1.5,
                background: done ? t.accent : t.borderStrong,
                margin:"0 6px", marginBottom:18, transition:"background 0.3s",
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Field wrapper
function Field({
  label, error, children, t,
}: {
  label: string; error?: string; children: ReactNode; t: ColorTokens;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11.5, fontWeight:600, color: error ? t.error : t.textLabel, letterSpacing:"0.06em", textTransform:"uppercase" as const, fontFamily:"inherit" }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize:11.5, color:t.error, display:"flex", alignItems:"center", gap:4 }}>
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
    <div style={{ position:"relative" }}>
      {icon && (
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", display:"flex" }}>
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
          width:"100%", boxSizing:"border-box",
          padding: `13px ${rightEl ? "40px" : "14px"} 13px ${icon ? "38px" : "14px"}`,
          background: bg,
          border: `1.5px solid ${borderColor}`,
          borderRadius:10,
          color: t.textPrimary,
          fontSize:14,
          fontFamily:"'DM Sans', sans-serif",
          outline:"none",
          transition:"all 0.2s",
          boxShadow,
        }}
      />
      {rightEl && (
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", display:"flex" }}>
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
      style={{
        width:"100%", padding:"13px 36px 13px 14px", boxSizing:"border-box" as const,
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius:10,
        color: value ? t.textPrimary : t.textMuted,
        fontSize:14, fontFamily:"'DM Sans', sans-serif",
        outline:"none", cursor:"pointer",
        transition:"all 0.2s",
        boxShadow,
        appearance:"none" as const,
        WebkitAppearance:"none" as const,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A8BAA' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat" as const,
        backgroundPosition:"right 13px center",
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
    <div style={{ marginTop:5 }}>
      <div style={{ display:"flex", gap:4, marginBottom:3 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i <= score ? color : t.borderStrong, transition:"background 0.3s" }}/>
        ))}
      </div>
      {label && <span style={{ fontSize:11, color, fontWeight:600 }}>{label}</span>}
    </div>
  );
}

// Photo uploader
function PhotoUpload({ t }: { t: ColorTokens }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
      <div style={{ position:"relative", cursor:"pointer" }} onClick={() => ref.current?.click()}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width:96, height:96, borderRadius:"50%",
            border: `2px dashed ${hovered ? t.accent : t.borderStrong}`,
            background: hovered ? t.accentSubtle : t.bgCard,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:5,
            overflow:"hidden", transition:"all 0.25s",
          }}
        >
          {preview ? (
            <img src={preview} alt="profile" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          ) : (
            <>
              <UserIcon color={hovered ? t.accent : t.textMuted}/>
              <span style={{ fontSize:12, color: hovered ? t.accent : t.textMuted, fontWeight:500 }}>Photo</span>
            </>
          )}
        </div>
        {/* + badge */}
        <div style={{
          position:"absolute", bottom:2, right:2,
          width:22, height:22, borderRadius:"50%",
          background: t.accent,
          border: `2px solid ${t.bgSurface}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.btnText} strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile}/>
      </div>
    </div>
  );
}

// Success screen
function SuccessScreen({ t, onBack }: { t: ColorTokens; onBack: () => void }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{
        width:72, height:72, borderRadius:"50%",
        background: t.accentSubtle, border: `1.5px solid ${t.accent}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        margin:"0 auto 20px",
      }}>
        <CheckIcon color={t.accent} size={30}/>
      </div>
      <h2 style={{ color:t.textPrimary, fontSize:22, fontWeight:800, fontFamily:"'Sora', sans-serif", marginBottom:8 }}>
        Registration Submitted!
      </h2>
      <p style={{ color:t.textMuted, fontSize:14, lineHeight:1.7, marginBottom:28 }}>
        Your account request is pending approval.<br/>
        Check your email for a confirmation link.
      </p>
      <button
        onClick={onBack}
        style={{
          background: t.btnBg, color: t.btnText,
          border:"none", borderRadius:10, padding:"13px 32px",
          fontSize:15, fontWeight:700, fontFamily:"'Sora', sans-serif",
          cursor:"pointer",
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
  const row2: CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 };

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
      minHeight:"100vh",
      background: t.bgPage,
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"40px 20px",
      fontFamily:"'DM Sans', sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width:"100%", maxWidth:640,
        background: t.bgSurface,
        border: `1px solid ${t.borderDefault}`,
        borderRadius:20,
        padding:"40px 44px 36px",
        boxShadow: t.shadow,
        position:"relative",
        overflow:"hidden",
      }}>
        {/* Ambient glow top-right */}
        <div style={{
          position:"absolute", top:-100, right:-100,
          width:280, height:280,
          background: t.accentSubtle,
          borderRadius:"50%", filter:"blur(60px)",
          pointerEvents:"none",
        }}/>

        {/* ── Brand row ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, position:"relative" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.btnText} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Sora', sans-serif", fontSize:15, fontWeight:700, color:t.textPrimary }}>ProcureOS</div>
              <div style={{ fontSize:10.5, color:t.textMuted, letterSpacing:"0.07em", textTransform:"uppercase" as const }}>Vendor ERP</div>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(th => th === "dark" ? "light" : "dark")}
            style={{
              background: t.bgCard, border:`1.5px solid ${t.borderStrong}`,
              borderRadius:8, padding:"7px 13px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:6,
              color: t.textMuted, fontSize:12, fontWeight:600,
              fontFamily:"'DM Sans', sans-serif",
              transition:"all 0.2s",
            }}
          >
            {theme === "dark" ? <SunIcon color={t.textMuted}/> : <MoonIcon color={t.textMuted}/>}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {/* ── Stepper ── */}
        <Stepper step={2} t={t}/>

        {submitted ? (
          <SuccessScreen t={t} onBack={resetForm}/>
        ) : (
          <>
            <h1 style={{ fontFamily:"'Sora', sans-serif", fontSize:22, fontWeight:800, color:t.textPrimary, marginBottom:3 }}>Registration</h1>
            <p style={{ fontSize:14, color:t.textMuted, marginBottom:24 }}>Complete your profile — Screen 2</p>

            {/* Photo upload */}
            <PhotoUpload t={t}/>

            {/* Google OAuth */}
            <button
              style={{
                width:"100%", padding:"11px 14px",
                background: t.bgCard, border:`1.5px solid ${t.borderStrong}`,
                borderRadius:10, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                color: t.textLabel, fontSize:14, fontWeight:600,
                fontFamily:"'DM Sans', sans-serif",
                marginBottom:18, transition:"all 0.2s",
              }}
            >
              <GoogleIcon/> Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:t.borderStrong }}/>
              <span style={{ fontSize:11, color:t.textMuted, fontWeight:600, letterSpacing:"0.06em" }}>OR FILL IN DETAILS</span>
              <div style={{ flex:1, height:1, background:t.borderStrong }}/>
            </div>

            {/* Row 1: First + Last Name */}
            <div style={{ ...row2, marginBottom:14 }}>
              <Field label="First Name" error={errors.firstName} t={t}>
                <TextInput value={fields.firstName} onChange={set("firstName")} placeholder="e.g. Pushkar" t={t}
                  icon={<UserIcon color={t.textMuted}/>} hasError={!!errors.firstName}/>
              </Field>
              <Field label="Last Name" error={errors.lastName} t={t}>
                <TextInput value={fields.lastName} onChange={set("lastName")} placeholder="e.g. Shinde" t={t} hasError={!!errors.lastName}/>
              </Field>
            </div>

            {/* Row 2: Email + Phone */}
            <div style={{ ...row2, marginBottom:14 }}>
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
            <div style={{ ...row2, marginBottom:14 }}>
              <Field label="Role (Admin, Officer)" error={errors.role} t={t}>
                <SelectInput value={fields.role} onChange={set("role")} options={ROLES} placeholder="Select role…" t={t} hasError={!!errors.role}/>
              </Field>
              <Field label="Country" error={errors.country} t={t}>
                <SelectInput value={fields.country} onChange={set("country")} options={COUNTRIES} placeholder="Select country…" t={t} hasError={!!errors.country}/>
              </Field>
            </div>

            {/* Additional info */}
            <div style={{ marginBottom:14 }}>
              <Field label="Additional Information" t={t}>
                <textarea
                  value={fields.additionalInfo}
                  onChange={set("additionalInfo")}
                  placeholder="Department, vendor categories you manage, any relevant details…"
                  rows={4}
                  style={{
                    width:"100%", boxSizing:"border-box" as const,
                    padding:"13px 14px",
                    background: t.bgInput,
                    border: `1.5px solid ${t.borderDefault}`,
                    borderRadius:10,
                    color: t.textPrimary,
                    fontSize:14, fontFamily:"'DM Sans', sans-serif",
                    outline:"none", resize:"vertical" as const,
                    lineHeight:1.6, transition:"all 0.2s",
                  }}
                />
              </Field>
            </div>

            {/* Row 4: Password + Confirm */}
            <div style={{ ...row2, marginBottom:8 }}>
              <Field label="Password" error={errors.password} t={t}>
                <TextInput
                  type={showPwd ? "text" : "password"}
                  value={fields.password} onChange={set("password")}
                  placeholder="Min. 8 characters" t={t} hasError={!!errors.password}
                  rightEl={
                    <button onClick={() => setShowPwd(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, display:"flex", padding:2 }}>
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
                    <button onClick={() => setShowCPwd(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, display:"flex", padding:2 }}>
                      {showCPwd ? <EyeSlash color={t.textMuted}/> : <EyeOpen color={t.textMuted}/>}
                    </button>
                  }
                />
              </Field>
            </div>

            {/* Terms checkbox */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, margin:"18px 0 6px", cursor:"pointer" }}
              onClick={() => { setFields(f => ({ ...f, agreed: !f.agreed })); setErrors(e => ({ ...e, agreed: undefined })); }}>
              <div style={{
                width:18, height:18, borderRadius:5, flexShrink:0, marginTop:2,
                background: fields.agreed ? t.accent : t.bgCard,
                border: `1.5px solid ${errors.agreed ? t.error : fields.agreed ? t.accent : t.borderStrong}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s",
              }}>
                {fields.agreed && <CheckIcon color={t.checkmark} size={10}/>}
              </div>
              <span style={{ fontSize:13, color:t.textMuted, lineHeight:1.55 }}>
                I agree to the{" "}
                <span style={{ color:t.accent, fontWeight:600 }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color:t.accent, fontWeight:600 }}>Privacy Policy</span>.
                {" "}Data is handled securely per procurement compliance standards.
              </span>
            </div>
            {errors.agreed && <p style={{ fontSize:11.5, color:t.error, marginBottom:10 }}>⚠ {errors.agreed}</p>}

            {/* Register button */}
            <button
              onClick={handleSubmit}
              style={{
                width:"100%", marginTop:20, padding:"15px",
                background: t.btnBg, color: t.btnText,
                border:"none", borderRadius:11,
                fontSize:16, fontWeight:700, fontFamily:"'Sora', sans-serif",
                cursor:"pointer", letterSpacing:"-0.01em",
                boxShadow:`0 4px 16px ${t.accentGlow}`,
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnHover; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnBg; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              Register →
            </button>

            <p style={{ textAlign:"center", marginTop:14, fontSize:13.5, color:t.textMuted }}>
              Already have an account?{" "}
              <span style={{ color:t.accent, fontWeight:600, cursor:"pointer" }}>Sign in</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}