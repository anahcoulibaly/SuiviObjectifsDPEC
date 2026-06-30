/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        syn: {
          primary:     '#4B2882',
          'primary-dark': '#2D1557',
          'primary-mid':  '#6B3FA0',
          accent:      '#C0297A',
          'accent-dark': '#A0206A',
          bg:          '#FFFFFF',
          'bg-alt':    '#F5F4F8',
          text:        '#1C1C2E',
          'text-muted':'#9A90A8',
          'text-sub':  '#3D3550',
          success:     '#00C48C',
          warning:     '#FF6B35',
          error:       '#E63946',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body:    ['Open Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'syn-sm': '0 1px 3px rgba(75,40,130,0.08)',
        'syn-md': '0 4px 12px rgba(75,40,130,0.12)',
        'syn-lg': '0 8px 32px rgba(75,40,130,0.16)',
      },
      borderRadius: {
        'syn': '4px',
        'syn-md': '8px',
        'syn-lg': '16px',
      },
    },
  },
  plugins: [],
}
