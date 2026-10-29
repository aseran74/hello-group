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
          DEFAULT: '#0c0c0c',
          soft: '#1a1a1a',
        },
        paper: {
          DEFAULT: '#f0f1ef',
          elevated: '#fafaf8',
        },
        mute: '#5e635f',
        line: '#d4d6d2',
        silver: '#b8bcb8',
        mist: '#f5f6f4',
        // Compat aliases used across existing templates
        moss: {
          DEFAULT: '#0c0c0c',
          deep: '#0a0a0a',
          soft: '#3a3a3a',
        },
        lichen: '#e8e8e6',
        fog: '#c4c4c0',
        slate: {
          ink: '#0c0c0c',
          muted: '#5e635f',
        },
        sand: '#f0f1ef',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '76rem',
      },
      letterSpacing: {
        brand: '0.18em',
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
