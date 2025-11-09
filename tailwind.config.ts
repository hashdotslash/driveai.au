import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { blue:"#007AFF" } } } },
  plugins: [],
};
export default config;
