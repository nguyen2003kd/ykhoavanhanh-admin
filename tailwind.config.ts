import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        // Primary: Deep Medical Blue — #0B5CAD (nguồn chatgpt.md Q3)
        primary: {
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
