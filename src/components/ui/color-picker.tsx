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
    className={cn("w-full h-[200px] rounded-md border shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
))
ColorPicker.displayName = "ColorPicker"

const ColorPickerHex = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
  ColorPickerProps
>(({ className, ...props }, ref) => (
  <HexColorPicker
    className={cn("rounded-none", className)}
    style={{
      width: "100%",
      height: "85%",
      borderRadius: "0",
    }}
    {...props}
  />
))
ColorPickerHex.displayName = "ColorPickerHex"

const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex w-full h-fit px-3 py-1 bg-transparent transition-colors uppercase text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
ColorPickerInput.displayName = "ColorPickerInput"

export { ColorPicker, ColorPickerHex, ColorPickerInput }