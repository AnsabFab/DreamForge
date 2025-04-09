import { createContext, ReactNode, useContext } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { CREDIT_PACKAGES } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

interface CreateOrderResult {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface CaptureOrderParams {
  orderId: string;
  packageId: number;
}

interface CreditsContextType {
  creditPackages: typeof CREDIT_PACKAGES;
  createOrderMutation: UseMutationResult<CreateOrderResult, Error, number>;
  captureOrderMutation: UseMutationResult<any, Error, CaptureOrderParams>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();

  const createOrderMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const res = await apiRequest("POST", "/api/payments/create-order", { packageId });
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const captureOrderMutation = useMutation({
    mutationFn: async ({ orderId, packageId }: CaptureOrderParams) => {
      const res = await apiRequest("POST", "/api/payments/capture-order", { orderId, packageId });
      return await res.json();
    },
    onSuccess: (data) => {
      // Update user data with new credits
      if (data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
      }
      
      toast({
        title: "Purchase successful",
        description: "Credits have been added to your account!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <CreditsContext.Provider
      value={{
        creditPackages: CREDIT_PACKAGES,
        createOrderMutation,
        captureOrderMutation,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
