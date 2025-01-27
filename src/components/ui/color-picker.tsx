"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { cn } from "@/lib/utils"

export type ColorPickerProps = React.ComponentProps<typeof HexColorPicker>

const ColorPicker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-fit h-fit min-h-[200px] rounded-md border shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
))
ColorPicker.displayName = "ColorPicker"

const ColorPickerHex = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof HexColorPicker>, 'onChange'> &
  ColorPickerProps
>(({ className, ...props }) => (
  <HexColorPicker
    className={cn("rounded-none w-[100% !important] h-[100% !important] border-[0 !important]", className)}
    {...props}
  />
))
ColorPickerHex.displayName = "ColorPickerHex"

// You can also use shadcn input instead of this one
const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex w-[200px] h-fit px-1 py-1 mt-0.5 bg-transparent transition-colors uppercase text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
ColorPickerInput.displayName = "ColorPickerInput"

export { ColorPicker, ColorPickerHex, ColorPickerInput }