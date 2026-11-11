"use client";

import { useEffect } from "react";

const activeLocks = new Set<string>();

export function setScrollLock(key: string, lock: boolean) {
  if (typeof document === "undefined") return;

  if (lock) {
    activeLocks.add(key);
  } else {
    activeLocks.delete(key);
  }

  if (activeLocks.size > 0) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
}

export function useScrollLock(key: string, lock: boolean) {
  useEffect(() => {
    if (lock) {
      setScrollLock(key, true);
      return () => {
        setScrollLock(key, false);
      };
    }
  }, [key, lock]);
}
