"use client";

import { useEffect } from "react";
import { startUipin } from "uipin";

// Dev-only: pins comments on rendered elements and hands the batch to the
// agent with file and line already attached.
export function UipinMount() {
  useEffect(() => {
    startUipin();
  }, []);
  return null;
}
