import { useEffect, useState } from "react";
import { Coins, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useCredits } from "@/hooks/use-credits";
import { useAuth } from "@/hooks/use-auth";
import { CREDIT_PACKAGES } from "@shared/schema";

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const { user } = useAuth();
  const { creditPackages, createOrderMutation, captureOrderMutation } = useCredits();
  const [selectedPackage, setSelectedPackage] = useState<number>(2); // Default to premium pack

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      createOrderMutation.reset();
      captureOrderMutation.reset();
    }
  }, [open, createOrderMutation, captureOrderMutation]);

  const handleBuyCredits = async () => {
    try {
      const orderResult = await createOrderMutation.mutateAsync(selectedPackage);
      
      // In a real implementation, we'd redirect to PayPal
      // For this example, we'll simulate successful payment
      if (orderResult && orderResult.id) {
        const approveLink = orderResult.links.find(link => link.rel === "approve");
        
        // Normally we'd redirect to approveLink.href
        // For now, we'll just simulate a successful payment
        await captureOrderMutation.mutateAsync({
          orderId: orderResult.id,
          packageId: selectedPackage
        });
        
        // Close modal on success
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Buy Credits</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Purchase credits to generate more AI images. Higher quality models require more credits.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                  selectedPackage === pkg.id
                    ? "border-2 border-indigo-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-500"
                } ${pkg.popular ? "relative" : ""}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 right-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{pkg.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="text-lg font-bold">${pkg.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 bg-indigo-500 bg-opacity-10 text-indigo-500 rounded-full p-2">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{pkg.credits} Credits</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      About {Math.floor(pkg.credits / 2)} HD images
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Subscription Plans</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get unlimited access to all features
              </p>
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                View Subscription Options
              </Button>
            </div>
          </div>

          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600 mb-3"
            onClick={handleBuyCredits}
            disabled={createOrderMutation.isPending || captureOrderMutation.isPending}
          >
            {createOrderMutation.isPending || captureOrderMutation.isPending ? (
              <>Processing...</>
            ) : (
              <>
                <span className="mr-2">Continue with PayPal</span>
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By purchasing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
