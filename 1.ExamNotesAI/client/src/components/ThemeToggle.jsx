import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='theme-chip flex items-center gap-2 px-4 py-2 text-sm font-semibold'
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
      <span className='hidden sm:inline'>{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}

export default ThemeToggle
