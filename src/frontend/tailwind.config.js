/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: ['BricolageGrotesque', 'system-ui', 'sans-serif'],
        sans: ['GeneralSans', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        gold: '#FFB800',
        crimson: '#CC2936',
        arcane: '#7B2FBE',
        parchment: '#F0E6D3',
        bronze: '#8B7355',
        obsidian: '#0A0A0F',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'ember-rise': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0.8' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,184,0,0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255,184,0,0.8)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'orb-orbit': {
          '0%': { transform: 'rotate(0deg) translateX(32px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(32px) rotate(-360deg)' },
        },
        'orb-fill': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'blink': 'blink 1s step-end infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'orb-orbit': 'orb-orbit 4s linear infinite',
        'float': 'float 3.125s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
