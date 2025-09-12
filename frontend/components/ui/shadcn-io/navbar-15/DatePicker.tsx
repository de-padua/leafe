'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { Button } from '../../button';
import { cn } from '@/lib/utils';
import { Calendar } from 'react-aria-components';


export interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = React.forwardRef<
  HTMLButtonElement,
  DatePickerProps
>(({ date, onDateChange, placeholder = "Pick a date", className }, ref) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const displayDate = date !== undefined ? date : selectedDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          className={cn(
            "justify-start text-left font-normal text-sm",
            !displayDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDate ? format(displayDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;