// useDebounce delays updating a value until the user stops changing it.
// Every time the input value changes, the timer resets.
// Only after the user pauses for `delay` ms does the debounced value update.

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If value changes before delay is up, cancel the previous timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
