import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Pand-A-Day-in-My-Life/",
  plugins: [react(), tailwindcss()],
});
