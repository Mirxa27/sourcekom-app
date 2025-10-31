import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SourceKom Brand Colors
        brand: {
          DEFAULT: 'var(--brand-primary)',
          primary: 'var(--brand-primary)',
          deep: 'var(--brand-primary-deep)',
          secondary: 'var(--brand-secondary)',
          highlight: 'var(--brand-highlight)',
          // Legacy aliases for backward compatibility
          blue: 'var(--brand-primary)',
          'blue-light': 'var(--brand-highlight)',
          yellow: 'var(--brand-secondary)',
          'yellow-dark': 'var(--brand-secondary)',
        },
        // App Semantic Colors
        app: {
          DEFAULT: 'var(--bg)',
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          text: 'var(--text)',
          muted: 'var(--text-muted)',
          border: 'var(--border)',
        },
        // State Colors
        state: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
        },
        // Legacy shadcn colors (preserved for compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border-color)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)'
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
        xl2: 'var(--radius-xl2)',
      },
      boxShadow: {
        app: 'var(--shadow-app)',
        'app-lg': 'var(--shadow-app-lg)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-deep) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-highlight) 100%)',
      },
    }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
