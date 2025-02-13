"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4 text-center",
        caption: "flex justify-center pt-1 items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center w-full h-fit absolute",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 -top-0.5"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 -top-0.5 rotate-180"
        ),
        table: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 aria-selected:bg-primary hover:text-primary-foreground focus:text-primary-foreground hover:bg-primary focus:bg-primary cursor-pointer"
        ),
        day: cn(
          "relative p-0 text-center text-sm font-normal",
          "focus-within:relative focus-within:z-20",
          "[&[aria-selected].outside]:bg-accent/50",
          props.mode === "range"
            ? [
              "[&[aria-selected]]:rounded-md",
              "first:aria-selected:rounded-l-md",
              "last:aria-selected:rounded-r-md",
            ].join(" ")
            : "[&[aria-selected]]:bg-accent [&[aria-selected]]:rounded-md",
        ),
        range_start: "rounded-l-md [&[aria-selected]]:bg-primary",
        range_end: "rounded-r-md [&[aria-selected]]:bg-primary",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Chevron: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
