import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#2a2a2a',
        },
        paper: {
          DEFAULT: '#f7f4ef',
          elevated: '#ffffff',
        },
        mute: '#6b6b6b',
        line: '#e8e2d9',
        silver: '#c4beb6',
        mist: '#fffaf5',
        accent: {
          DEFAULT: '#ff6b35',
          soft: '#ff8a5c',
          deep: '#e85a28',
        },
        // Compat aliases used across existing templates
        moss: {
          DEFAULT: '#1a1a1a',
          deep: '#0f0f0f',
          soft: '#3a3a3a',
        },
        lichen: '#efeae3',
        fog: '#c4beb6',
        slate: {
          ink: '#1a1a1a',
          muted: '#6b6b6b',
        },
        sand: '#f7f4ef',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '76rem',
      },
      letterSpacing: {
        brand: '0.18em',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(26, 26, 26, 0.08)',
        card: '0 12px 40px rgba(26, 26, 26, 0.06)',
      },
      borderRadius: {
        ahead: '1.75rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 1s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(1.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
