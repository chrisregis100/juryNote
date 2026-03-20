"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  "aria-label"?: string;
  "aria-valuetext"?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, "aria-label": ariaLabel, "aria-valuetext": ariaValueText, value, min, max, ...props }, ref) => {
  const computedValueText = React.useMemo(() => {
    if (ariaValueText) return ariaValueText;
    if (value && typeof value[0] === "number" && typeof max === "number") {
      return `${value[0]} sur ${max}`;
    }
    return undefined;
  }, [ariaValueText, value, max]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      aria-label={ariaLabel}
      aria-valuetext={computedValueText}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-slate-200">
        <SliderPrimitive.Range className="absolute h-full bg-indigo-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
