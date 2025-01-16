import React from 'react'
import { contrastColor } from 'contrast-color'

const Swatch = ({ label, color, children }) => {
  if (!color) return null

  return (
    <div
      className="swatch"
      aria-label={label}
      style={{
        '--swatchColor': color,
        '--swatchBorder': color
          ? contrastColor({ bgColor: color })
          : null,
      }}
    >
      {children}
    </div>
  )
}

export default Swatch
