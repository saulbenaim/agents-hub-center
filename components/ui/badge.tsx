import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: "neutral" | "pink" | "blue" | "green" | "amber";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral:
    "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
  pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  green:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
