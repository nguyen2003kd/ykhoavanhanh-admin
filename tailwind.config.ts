import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-primary-500', 'bg-primary-600',
    'bg-secondary-500', 'bg-secondary-600',
    'bg-accent-400', 'bg-accent-500',
    'bg-green-500', 'bg-green-600',
    'bg-orange-500', 'bg-orange-600',
    'bg-yellow-500', 'bg-yellow-600',
    'bg-red-500', 'bg-red-600',
    'bg-purple-500', 'bg-purple-600',
    'bg-gray-500', 'bg-gray-600',
    'bg-teal-500', 'bg-teal-600',
    'bg-rose-500', 'bg-rose-600',
    'text-white',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic tokens — map tới CSS variables
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        // Primary: Deep Medical Blue — #0B5CAD (nguồn chatgpt.md Q3)
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50:  "#EEF4FB",
          100: "#D5E5F6",
          200: "#ACCBEE",
          300: "#82B1E5",
          400: "#4F89D1",
          500: "#1A6BBF",
          600: "#0B5CAD", // PRIMARY main
          700: "#094D93",
          800: "#073D75",
          900: "#052D55",
          950: "#031C36",
        },
        // Secondary: Healthcare Teal — #00A6A6 (nguồn chatgpt.md Q3)
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50:  "#E0F7F7",
          100: "#B3ECEC",
          200: "#80DFDF",
          300: "#4DD2D2",
          400: "#26C7C7",
          500: "#00A6A6", // SECONDARY main
          600: "#008F8F",
          700: "#007575",
          800: "#005C5C",
          900: "#003D3D",
        },
        // Accent: Soft Gold — #F5B942 (membership, voucher, điểm)
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          300: "#FAD88A",
          400: "#F8CC65",
          500: "#F5B942", // ACCENT main
          600: "#E09B1A",
          700: "#B87D12",
        },
        // Background: Soft Ice Blue — #F4F9FD
        "bg-app": "#F4F9FD",
        // Text
        "text-navy": "#102A43",
        "text-slate": "#627D98",
        // Border
        "border-blue": "#D9E6F2",
        "border-focus": "#0B5CAD",
        // Primary aliases from mobile
        "primary-light": "#EAF3FC",
        "primary-dark": "#083B6F",
        // Secondary aliases from mobile
        "secondary-light": "#E6F7F7",
        // Accent aliases from mobile
        "accent-light": "#FFF7E6",
        // Semantic colors from mobile
        success: {
          DEFAULT: "#2BB673",
          light: "#EAFBF3",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFF7E6",
        },
        error: {
          DEFAULT: "#E5484D",
          light: "#FFDAD6",
        },
        info: "#1D8FE3",
        // Surface
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F2F3FB",
        },
        // Text extra
        "text-disabled": "#9FB3C8",
        "text-inverse": "#FFFFFF",
        // Overlay
        overlay: "rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "14px",
        "2xl": "20px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(11, 92, 173, 0.08), 0 1px 2px rgba(11, 92, 173, 0.04)",
        "card-hover": "0 4px 12px rgba(11, 92, 173, 0.12), 0 2px 4px rgba(11, 92, 173, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
