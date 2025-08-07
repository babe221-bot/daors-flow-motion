"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { animateThemeChange } from "@/lib/animation-utils"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme } = props
  
  React.useEffect(() => {
    if (theme) {
      // Use requestAnimationFrame to ensure the theme class is applied
      requestAnimationFrame(() => {
        animateThemeChange()
      })
    }
  }, [theme])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
