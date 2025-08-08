import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  disableTransitionOnChange = false 
}: ThemeProviderProps) {
  React.useEffect(() => {
    // Apply dark theme by default
    document.documentElement.classList.add('dark')
  }, [])

  return <>{children}</>
}
