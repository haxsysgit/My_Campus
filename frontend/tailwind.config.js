module.exports = {
  content: [
    './app/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-card': '#F6F7F8',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'accent-blue': '#3B82F6',
        'accent-coral': '#FF6B6B',
        'accent-green': '#22C55E',
        'danger-red': '#EF4444',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
