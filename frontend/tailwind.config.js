/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // Add this if you're using the /app directory
    ],
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          card: "hsl(var(--card))",
          "card-foreground": "hsl(var(--card-foreground))",
          primary: "hsl(var(--primary))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          secondary: "hsl(var(--secondary))",
          "secondary-foreground": "hsl(var(--secondary-foreground))",
          muted: "hsl(var(--muted))",
          "muted-foreground": "hsl(var(--muted-foreground))",
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
          destructive: "hsl(var(--destructive))",
          "destructive-foreground": "hsl(var(--destructive-foreground))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
        },
      },
    },
    plugins: [],
  };
  