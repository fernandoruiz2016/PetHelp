export type ColorScheme = "light" | "dark";

type Gradient = {
  colors: readonly [string, string, ...string[]];
  locations: readonly [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

const light = {
  gradient: {
    colors: [
      "rgba(255, 215, 114, 1)",
      "rgba(255, 255, 255, 0.5)",
      "rgba(255, 255, 255, 0.5)",
      "rgba(0, 142, 150, 1)",
    ],
    locations: [0, 0.3, 0.7, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  } as Gradient,

  background: "#ffffff",

  primary: "#0AA0A3",
  primaryPressed: "#088587",
  primaryDisabled: "#9FD9DA",
  primarySoft: "#A6EBE0",
  onPrimary: "#FFFFFF",

  accent: "#C8851B",
  accentLight: "#F7BF30",
  accentSoft: "#FFE79E",

  title: "#09676C",
  text: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  placeholder: "#9CA3AF",

  form: "#FFFFFF",
  input: "#FFFFFF",
  inputBorder: "#D1D5DB",
  border: "#E5E7EB",

  success: "#16A34A",
  error: "#DC2626",
};

export type Theme = typeof light;

const dark: Theme = {
  gradient: {
    colors: [
      "rgba(61, 47, 11, 1)",
      "rgba(15, 31, 34, 0.9)",
      "rgba(15, 31, 34, 0.9)",
      "rgba(4, 41, 44, 1)",
    ],
    locations: [0, 0.3, 0.7, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },

  background: "#0B1618",

  primary: "#14B8BB",
  primaryPressed: "#0AA0A3",
  primaryDisabled: "#25494A",
  primarySoft: "#12403F",
  onPrimary: "#04272A",

  accent: "#F7BF30",
  accentLight: "#FFE79E",
  accentSoft: "#4A3A10",

  title: "#A6EBE0",
  text: "#F3F4F6",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  placeholder: "#6B7280",

  form: "#13262A",
  input: "#0F1F22",
  inputBorder: "#2C4A4E",
  border: "#1F3A3E",

  success: "#4ADE80",
  error: "#F87171",
};

export const Colors: Record<ColorScheme, Theme> = { light, dark };
