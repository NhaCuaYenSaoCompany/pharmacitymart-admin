import type { ReactNode } from "react";
import "./GlobalStyle.css";

interface GlobalStyleProps {
  children: ReactNode;
}

export function GlobalStyle({ children }: GlobalStyleProps) {
  return children;
}
