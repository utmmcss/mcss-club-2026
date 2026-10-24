import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Lyneous", "Arial", "sans-serif"],
        heading: ["Dagestan", "Arial", "sans-serif"],
        sub: ['"Louis George Cafe"', "Arial", "sans-serif"],
        body: ["Walkway", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "mcss-gradient": "var(--mcss-gradient)",
        "mcss-gradient-x": "var(--mcss-gradient-x)",
      },
      colors: {
        // color-mix keeps the CSS vars as the single source while letting /80-style opacity modifiers work.
        mcss: {
          wash: "var(--mcss-wash)",
          sky: "color-mix(in srgb, var(--mcss-sky) calc(<alpha-value> * 100%), transparent)",
          blue: "color-mix(in srgb, var(--mcss-blue) calc(<alpha-value> * 100%), transparent)",
          periwinkle: "color-mix(in srgb, var(--mcss-periwinkle) calc(<alpha-value> * 100%), transparent)",
          purple: "color-mix(in srgb, var(--mcss-purple) calc(<alpha-value> * 100%), transparent)",
          ink: "color-mix(in srgb, var(--mcss-ink) calc(<alpha-value> * 100%), transparent)",
          paper: "color-mix(in srgb, var(--mcss-paper) calc(<alpha-value> * 100%), transparent)",
          cloud: "color-mix(in srgb, var(--mcss-cloud) calc(<alpha-value> * 100%), transparent)",
          muted: "color-mix(in srgb, var(--mcss-muted) calc(<alpha-value> * 100%), transparent)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "max(0px, calc(var(--radius) - 4px))",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
