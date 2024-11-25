/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom background color
        foreground: "var(--foreground)", // Custom foreground color
      },
    },
    screens: {
      sm: "640px",  // Small devices (e.g., phones)
      md: "768px",  // Medium devices (e.g., tablets)
      lg: "1024px", // Large devices (e.g., laptops)
      xl: "1280px", // Extra large devices (e.g., desktops)
      "2xl": "1536px", // Extra extra large (large desktops)
    },
  },
  plugins: [], // Add any Tailwind plugins here, if needed
};
