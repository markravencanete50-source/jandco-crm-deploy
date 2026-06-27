import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        ink: '#1A1A18',
        pine: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#1C4532',
          800: '#166534',
          900: '#0f3d24',
        },
        clay: {
          DEFAULT: '#C8693B',
          500: '#C8693B',
        },
        slate: {
          400: '#94a3b8',
          500: '#64748b',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      letterSpacing: {
        wide2: '0.08em',
        wide3: '0.12em',
      },
    },
  },
  plugins: [],
}

export default config