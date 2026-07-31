"use client";

import { useEffect } from "react";

export default function ClearCart() {
  useEffect(() => {
    window.localStorage.removeItem("meharbaan-cart");
    window.localStorage.removeItem("meharbaan-checkout");
  }, []);
  return null;
}
