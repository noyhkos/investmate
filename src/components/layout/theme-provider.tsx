"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Class strategy: shadcn tokens live under `.dark`, and the chart library
// reads the same custom properties, so one class switches both.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
