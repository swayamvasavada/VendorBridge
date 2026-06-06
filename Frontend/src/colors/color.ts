// colors.ts — ProcureOS Procurement & Vendor Management ERP
// Single source of truth for all color tokens. Import `tokens(theme)` in any component.

export type Theme = "light" | "dark";

// ─── Raw palette ─────────────────────────────────────────────────────────────
export const palette = {
  teal: {
    50:  "#E0FBF7",
    100: "#B3F4EC",
    200: "#7FECDF",
    300: "#4DE3D1",
    400: "#26D9C3",
    500: "#00CDB4",  // brand primary
    600: "#00B09A",
    700: "#008F7C",
    800: "#006E5F",
    900: "#004D43",
  },
  navy: {
    50:  "#E8ECF5",
    100: "#C5CEE5",
    200: "#9FAECF",
    300: "#788EB9",
    400: "#5B75A8",
    500: "#3E5C96",
    600: "#344E82",
    700: "#263E6A",
    800: "#1A2E52",
    900: "#0D1626",  // darkest bg
  },
  slate: {
    50:  "#F0F4FA",
    100: "#D8E0EF",
    200: "#BECBD9",
    300: "#A3B2CC",
    400: "#8797B5",
    500: "#6B7A96",
    600: "#526079",
    700: "#3D4F70",
    800: "#2A3A57",
    900: "#1A2540",
  },
  amber: {
    400: "#FFCF50",
    500: "#FFBF40",
    600: "#E0A800",
  },
  green: {
    400: "#3DD68C",
    500: "#28C47A",
    600: "#1CAF6A",
  },
  red: {
    400: "#F07080",
    500: "#F06070",
    600: "#D94A5A",
  },
  white: "#FFFFFF",
  black: "#0A0C12",
} as const;

// ─── Semantic token shape ─────────────────────────────────────────────────────
export interface ColorTokens {
  // Backgrounds
  bgPage:         string;
  bgSurface:      string;
  bgCard:         string;
  bgCardHover:    string;
  bgInput:        string;
  bgInputHover:   string;
  bgElevated:     string;

  // Text
  textPrimary:    string;
  textSecondary:  string;
  textMuted:      string;
  textLabel:      string;
  textOnAccent:   string;

  // Borders
  borderSubtle:   string;
  borderDefault:  string;
  borderStrong:   string;
  borderFocus:    string;

  // Brand / Accent
  accent:         string;
  accentHover:    string;
  accentSubtle:   string;
  accentGlow:     string;

  // Status
  success:        string;
  warning:        string;
  error:          string;

  // Button
  btnBg:          string;
  btnText:        string;
  btnHover:       string;

  // Misc
  shadow:         string;
  logoText:       string;
  checkmark:      string;
}

// ─── Dark theme ───────────────────────────────────────────────────────────────
export const darkTokens: ColorTokens = {
  bgPage:         palette.navy[900],          // #0D1626
  bgSurface:      "#131E30",
  bgCard:         palette.slate[900],          // #1A2540
  bgCardHover:    "#1E2B47",
  bgInput:        palette.slate[900],
  bgInputHover:   "#1E2B47",
  bgElevated:     "#1A2540",

  textPrimary:    "#EEF2FA",
  textSecondary:  "#C8D3E8",
  textMuted:      "#7A8BAA",
  textLabel:      palette.slate[300],          // #A3B2CC
  textOnAccent:   palette.navy[900],

  borderSubtle:   "rgba(255,255,255,0.07)",
  borderDefault:  "rgba(255,255,255,0.09)",
  borderStrong:   "rgba(255,255,255,0.16)",
  borderFocus:    palette.teal[500],

  accent:         palette.teal[500],           // #00CDB4
  accentHover:    palette.teal[400],
  accentSubtle:   "rgba(0,205,180,0.10)",
  accentGlow:     "rgba(0,205,180,0.20)",

  success:        palette.green[400],
  warning:        palette.amber[500],
  error:          palette.red[500],

  btnBg:          palette.teal[500],
  btnText:        palette.navy[900],
  btnHover:       palette.teal[400],

  shadow:         "0 8px 32px rgba(0,0,0,0.45)",
  logoText:       palette.teal[400],
  checkmark:      palette.navy[900],
};

// ─── Light theme ─────────────────────────────────────────────────────────────
export const lightTokens: ColorTokens = {
  bgPage:         palette.slate[50],           // #F0F4FA
  bgSurface:      palette.white,
  bgCard:         "#F5F7FC",
  bgCardHover:    "#EBF0F8",
  bgInput:        palette.white,
  bgInputHover:   "#EDF3FF",
  bgElevated:     "#ECEEF5",

  textPrimary:    palette.navy[900],
  textSecondary:  palette.slate[700],
  textMuted:      palette.slate[500],
  textLabel:      palette.slate[700],
  textOnAccent:   palette.white,

  borderSubtle:   "rgba(0,0,0,0.06)",
  borderDefault:  "rgba(0,0,0,0.09)",
  borderStrong:   "rgba(0,0,0,0.15)",
  borderFocus:    palette.teal[500],

  accent:         palette.teal[600],           // slightly darker for contrast on white
  accentHover:    palette.teal[700],
  accentSubtle:   "rgba(0,176,154,0.10)",
  accentGlow:     "rgba(0,176,154,0.18)",

  success:        palette.green[600],
  warning:        palette.amber[600],
  error:          palette.red[600],

  btnBg:          palette.teal[500],
  btnText:        palette.white,
  btnHover:       palette.teal[600],

  shadow:         "0 4px 24px rgba(0,0,0,0.08)",
  logoText:       palette.teal[600],
  checkmark:      palette.white,
};

// ─── Helper ───────────────────────────────────────────────────────────────────
export const tokens = (theme: Theme): ColorTokens =>
  theme === "dark" ? darkTokens : lightTokens;

export default tokens;