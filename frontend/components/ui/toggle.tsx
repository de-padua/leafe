"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground transition-all duration-200 data-[state=on]:bg-accent-foreground/5 data-[state=on]:text-accent-foreground  ",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-muted hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8",
        lg: "h-10 px-4 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
