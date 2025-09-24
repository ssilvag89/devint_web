// Utility for creating class name strings with conditional logic

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, any>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

// Alternative clsx implementation for better performance
export function clsx(...inputs: ClassValue[]): string {
  return cn(...inputs);
}

// Tailwind merge utility for conflicting classes
export function twMerge(...classNames: string[]): string {
  // Simple implementation - in production, consider using tailwind-merge library
  const classes = classNames
    .filter(Boolean)
    .join(" ")
    .split(" ")
    .filter(Boolean);

  // Remove duplicates, keeping the last occurrence
  const uniqueClasses = new Set<string>();
  const conflicts = new Map<string, string>();

  // Define conflicting class prefixes
  const conflictingPrefixes = [
    "bg-",
    "text-",
    "border-",
    "p-",
    "px-",
    "py-",
    "pt-",
    "pb-",
    "pl-",
    "pr-",
    "m-",
    "mx-",
    "my-",
    "mt-",
    "mb-",
    "ml-",
    "mr-",
    "w-",
    "h-",
    "flex-",
    "grid-",
    "gap-",
    "space-x-",
    "space-y-",
    "rounded-",
    "shadow-",
    "opacity-",
    "translate-x-",
    "translate-y-",
    "scale-",
    "rotate-",
    "skew-x-",
    "skew-y-",
    "z-",
    "top-",
    "right-",
    "bottom-",
    "left-",
    "inset-",
  ];

  for (const className of classes) {
    let hasConflict = false;

    for (const prefix of conflictingPrefixes) {
      if (className.startsWith(prefix)) {
        conflicts.set(prefix, className);
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      uniqueClasses.add(className);
    }
  }

  // Add the latest conflicting classes
  for (const className of conflicts.values()) {
    uniqueClasses.add(className);
  }

  return Array.from(uniqueClasses).join(" ");
}

// Combined utility function
export function cva(
  base: string,
  variants?: Record<string, Record<string, string>>
) {
  return (props?: Record<string, any>) => {
    if (!variants || !props) return base;

    const variantClasses = Object.entries(props)
      .map(([key, value]) => {
        const variant = variants[key];
        return variant && variant[value] ? variant[value] : "";
      })
      .filter(Boolean);

    return cn(base, ...variantClasses);
  };
}
