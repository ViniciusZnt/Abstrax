"use client"

import { useEffect, useState } from "react"
import { HexColorInput, HexColorPicker as ReactColorPicker } from "react-colorful"

interface HexColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function HexColorPicker({ color, onChange }: HexColorPickerProps) {
  const [value, setValue] = useState(color)

  useEffect(() => {
    setValue(color)
  }, [color])

  const handleChange = (newColor: string) => {
    setValue(newColor)
    onChange(newColor)
  }

  return (
    <div className="p-3 space-y-3">
      <ReactColorPicker color={value} onChange={handleChange} />
      <div className="flex items-center">
        <span className="mr-2 text-sm">Hex:</span>
        <HexColorInput
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          color={value}
          onChange={handleChange}
          prefixed
        />
      </div>
    </div>
  )
}

