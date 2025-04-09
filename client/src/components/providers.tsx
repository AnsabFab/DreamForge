import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { CreditsProvider } from "@/hooks/use-credits";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CreditsProvider>
            {children}
          </CreditsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
