module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FFEDED',
          200: '#FFE0E0',
          300: '#FFC9C9',
          400: '#FFB2B2',
          500: '#FF6B6B',
          600: '#E65A5A',
          700: '#B34848',
          800: '#803333',
          900: '#4D1F1F',
        },
        secondary: {
          50: '#F0FBF9',
          100: '#DCF7F4',
          200: '#B8EFE9',
          300: '#95E7DE',
          400: '#72DFD4',
          500: '#4ECDC4',
          600: '#43B5AE',
          700: '#358D87',
          800: '#266660',
          900: '#183F3A',
        },
        accent: {
          50: '#FFFFF4',
          100: '#FFFFE9',
          200: '#FFFFCC',
          300: '#FFFFB3',
          400: '#FFFF99',
          500: '#FFE66D',
          600: '#E6CC61',
          700: '#B39348',
          800: '#806A33',
          900: '#4D401F',
        },
        background: {
          DEFAULT: '#0F172A',
          100: '#1E293B',
          200: '#334155',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};