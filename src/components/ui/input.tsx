import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-app placeholder:text-app-muted selection:bg-brand selection:text-app bg-app border-app flex h-9 w-full min-w-0 rounded-xl2 border px-3 py-1 text-base shadow-app transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-brand focus-visible:ring-brand/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-state-error/20 dark:aria-invalid:ring-state-error/40 aria-invalid:border-state-error",
        className
      )}
      {...props}
    />
  )
}

export { Input }
