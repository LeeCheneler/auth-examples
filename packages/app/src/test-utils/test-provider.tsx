import React from "react";
import { Router } from "react-router-dom";
import type { History } from "history";
import type { AuthService } from "../services/auth";
import { AuthProvider } from "../components/auth-provider";
import { createMockHistory, createMockAuthService } from "../test-utils/mocks";

interface TestProviderProps {
  children: React.ReactNode;
  authService?: AuthService;
  history?: History;
}

export const TestProvider: React.FC<TestProviderProps> = ({
  children,
  history,
  authService,
}) => {
  return (
    <Router history={history ?? createMockHistory()}>
      <AuthProvider authService={authService ?? createMockAuthService()}>
        {children}
      </AuthProvider>
    </Router>
  );
};
