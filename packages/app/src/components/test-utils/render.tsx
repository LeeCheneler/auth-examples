import React from "react";
import { act } from "react-dom/test-utils";
import { render as RTLRender, RenderResult } from "@testing-library/react";
import { TestProvider } from "./test-provider";

export const render = async (
  children: React.ReactNode
): Promise<RenderResult> => {
  let renderResult: RenderResult;

  await act(async () => {
    renderResult = RTLRender(<TestProvider>{children}</TestProvider>);
  });

  // @ts-ignore - we know this will definitely be assigned
  return renderResult as RenderResult;
};
