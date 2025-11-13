import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Original styles
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Border styles - made more visible
        "border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500",
        // Focus and invalid states
        "focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-1 focus-visible:outline-none",
        "aria-invalid:border-red-500 dark:aria-invalid:border-red-400",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
