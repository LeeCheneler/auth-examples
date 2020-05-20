import React from "react";
import { act } from "react-dom/test-utils";
import type { History } from "history";
import { render as RTLRender, RenderResult } from "@testing-library/react";
import type { AuthService } from "../../services/auth";
import { TestProvider } from "./test-provider";

export const render = async (
  children: React.ReactNode,
  options?: {
    authService?: AuthService;
    history?: History;
  }
): Promise<RenderResult> => {
  let renderResult: RenderResult;

  await act(async () => {
    renderResult = RTLRender(
      <TestProvider
        authService={options?.authService}
        history={options?.history}
      >
        {children}
      </TestProvider>
    );
  });

  // @ts-ignore - we know this will definitely be assigned
  return renderResult as RenderResult;
};
