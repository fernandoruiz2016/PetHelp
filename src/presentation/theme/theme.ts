export type Theme = {
  text: string;
  background: string;
  tint: string;
};

export const Colors: Record<"light" | "dark", Theme> = {
  light: {
    text: "#000000",
    background: "#FFFFFF",
    tint: "#0a7ea4",
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#FFFFFF",
  },
};
