"use client"

import React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange>>
}

/**
 * DateRangePicker component used to select a date range
 * @param {className} - CSS classes to apply
 * @param {date} - Date range
 * @param {setDate} - Set date range
 * @returns {React.ReactElement}
 */
const DateRangePicker = ({ className, date, setDate }: DateRangePickerProps) => {
  const handleSelect: SelectRangeEventHandler = (nextRange, selectedDay) => {
    setDate((range) => {
      if (range?.from && range?.to) return { from: selectedDay };
      return nextRange as DateRange;
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRangePicker;