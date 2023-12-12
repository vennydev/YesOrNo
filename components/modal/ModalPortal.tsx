'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalPoral ({ children }: { children: ReactElement }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (typeof window === "undefined") return <></>;

  return mounted ? createPortal(children, document.getElementById("modal-root") as HTMLElement) : <></>;
}