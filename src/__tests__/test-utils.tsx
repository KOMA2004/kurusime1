import React from "react";
import type { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "../components/ui/provider";

function Providers({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}

export function renderWithChakra(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: Providers, ...options });
}