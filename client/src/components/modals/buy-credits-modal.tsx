import { useEffect, useState } from "react";
import { Coins, X, Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { CREDIT_PACKAGES } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number>(2); // Default to premium pack
  const [checkoutStep, setCheckoutStep] = useState<'selectPackage' | 'payment' | 'processing'>('selectPackage');

  // Create order mutation
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

  // Capture order mutation
  const captureOrderMutation = useMutation({
    mutationFn: async ({ orderId, packageId }: { orderId: string, packageId: number }) => {
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

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      createOrderMutation.reset();
      captureOrderMutation.reset();
    }
  }, [open, createOrderMutation, captureOrderMutation]);

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setCheckoutStep('selectPackage');
    }
  }, [open]);

  const handleProceedToPayment = () => {
    setCheckoutStep('payment');
  };

  const handleBuyCredits = async () => {
    try {
      setCheckoutStep('processing');
      const orderResult = await createOrderMutation.mutateAsync(selectedPackage);
      
      // In a real implementation, we'd redirect to PayPal
      // For this example, we'll simulate successful payment
      if (orderResult && orderResult.id) {
        const approveLink = orderResult.links.find((link: any) => link.rel === "approve");
        
        // Show a loading state for 2 seconds to simulate the PayPal checkout
        setTimeout(async () => {
          try {
            // Capture the order
            await captureOrderMutation.mutateAsync({
              orderId: orderResult.id,
              packageId: selectedPackage
            });
            
            // Close modal on success
            toast({
              title: "Credits added successfully!",
              description: `Your purchase has been completed and credits added to your account.`,
              variant: "default",
            });
            onClose();
          } catch (error) {
            console.error("Payment capture error:", error);
            setCheckoutStep('payment');
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCheckoutStep('selectPackage');
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
          {checkoutStep === 'selectPackage' && (
            <>
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
                onClick={handleProceedToPayment}
              >
                Continue to Checkout
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By purchasing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          )}

          {checkoutStep === 'payment' && (
            <>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="mb-2">Step 2 of 2</Badge>
                  <h3 className="text-xl font-bold mb-2">Complete Your Purchase</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Review your purchase details and complete the payment
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  {selectedPackage && (
                    <div className="flex justify-between items-center mb-2">
                      <span>{CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.name}</span>
                      <span className="font-medium">${CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>${CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Payment Method</h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-20 mr-2 flex items-center justify-center">
                          {/* PayPal Logo */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 100 32">
                            <path fill="#253B80" d="M 11.3 2.5 L 4.1 2.5 C 3.6 2.5 3.2 2.9 3.1 3.4 L 0.1 23.9 C 0 24.2 0.2 24.5 0.5 24.5 L 4 24.5 C 4.5 24.5 4.9 24.1 5 23.6 L 5.8 18.3 C 5.9 17.8 6.3 17.4 6.8 17.4 L 9.3 17.4 C 13.8 17.4 16.4 15.1 17.2 10.9 C 17.5 9 17.3 7.6 16.5 6.5 C 15.7 5.3 13.8 4.5 11.3 4.5 L 11.3 2.5 Z M 12.2 11.1 C 11.8 13.5 9.9 13.5 8.1 13.5 L 7 13.5 L 7.8 8.2 C 7.8 7.9 8.1 7.7 8.4 7.7 L 8.9 7.7 C 10.1 7.7 11.3 7.7 11.9 8.4.4 C 12.3 9 12.4 9.8 12.2 11.1 Z"/>
                            <path fill="#253B80" d="M 35.2 11.1 L 31.8 11.1 C 31.5 11.1 31.2 11.3 31.2 11.6 L 31 12.9 L 30.8 12.6 C 30.1 11.5 28.6 11.1 27.1 11.1 C 23.8 11.1 21 13.7 20.4 17.4 C 20 19.3 20.4 21.1 21.4 22.3 C 22.3 23.5 23.7 24 25.3 24 C 28 24 29.4 22.2 29.4 22.2 L 29.2 23.5 C 29.1 23.8 29.3 24.1 29.6 24.1 L 32.7 24.1 C 33.2 24.1 33.6 23.7 33.7 23.2 L 35.6 11.6 C 35.7 11.3 35.5 11.1 35.2 11.1 Z M 30.4 17.5 C 30 19.3 28.6 20.5 26.8 20.5 C 25.9 20.5 25.2 20.2 24.7 19.7 C 24.3 19.2 24.1 18.4 24.3 17.5 C 24.6 15.7 26.1 14.4 27.9 14.4 C 28.8 14.4 29.5 14.7 30 15.2 C 30.5 15.8 30.7 16.6 30.4 17.5 Z"/>
                            <path fill="#253B80" d="M 55.2 11.1 L 51.7 11.1 C 51.4 11.1 51 11.3 50.9 11.6 L 47.3 23.6 C 47.2 23.9 47.4 24.1 47.7 24.1 L 49.9 24.1 C 50.2 24.1 50.6 23.9 50.7 23.6 L 51.7 17.4 C 51.8 16.9 52.2 16.5 52.7 16.5 L 54.5 16.5 C 58.9 16.5 61.5 14.2 62.3 10 C 62.6 8.1 62.4 6.7 61.6 5.6 C 60.8 4.5 59 3.6 56.5 3.6 L 50.6 3.6 C 50.1 3.6 49.7 4 49.6 4.5 L 46.6 23.5 C 46.5 23.8 46.7 24.1 47 24.1 L 50.5 24.1 C 51 24.1 51.4 23.7 51.5 23.2 L 52.4 17.7 C 52.5 17.2 52.9 16.8 53.4 16.8 L 55 16.8 C 59.4 16.8 62 14.5 62.8 10.3 C 63.1 8.4 62.9 7 62.1 5.9 C 61.3 4.7 59.5 3.9 57 3.9 L 51.1 3.9 C 50.6 3.9 50.2 4.3 50.1 4.8 L 47.1 23.8 C 47 24.1 47.2 24.4 47.5 24.4 L 51 24.4 C 51.5 24.4 51.9 24 52 23.5 L 55.6 11.5 C 55.7 11.3 55.5 11.1 55.2 11.1 Z"/>
                            <path fill="#179BD7" d="M 59.6 10.7 C 59.2 13.1 57.3 13.1 55.5 13.1 L 54.4 13.1 L 55.2 7.8 C 55.2 7.5 55.5 7.3 55.8 7.3 L 56.3 7.3 C 57.5 7.3 58.7 7.3 59.3 8 C 59.7 8.4 59.8 9.3 59.6 10.7 Z"/>
                            <path fill="#179BD7" d="M 75.6 10.7 L 72.2 10.7 C 71.9 10.7 71.6 10.9 71.6 11.2 L 71.4 12.5 L 71.2 12.2 C 70.5 11.1 69 10.7 67.5 10.7 C 64.2 10.7 61.4 13.3 60.8 17 C 60.4 18.9 60.8 20.7 61.8 21.9 C 62.7 23.1 64.1 23.6 65.7 23.6 C 68.4 23.6 69.8 21.8 69.8 21.8 L 69.6 23.1 C 69.5 23.4 69.7 23.7 70 23.7 L 73.1 23.7 C 73.6 23.7 74 23.3 74.1 22.8 L 76 11.2 C 76.1 11 75.9 10.7 75.6 10.7 Z M 70.9 17.1 C 70.5 18.9 69.1 20.1 67.3 20.1 C 66.4 20.1 65.7 19.8 65.2 19.3 C 64.8 18.8 64.6 18 64.8 17.1 C 65.1 15.3 66.6 14 68.4 14 C 69.3 14 70 14.3 70.5 14.8 C 70.9 15.3 71.1 16.1 70.9 17.1 Z"/>
                            <path fill="#179BD7" d="M 89.9 10.7 L 86.4 10.7 C 86 10.7 85.7 10.9 85.5 11.2 L 81.6 17.1 L 80 11.4 C 79.9 11 79.5 10.7 79.1 10.7 L 75.7 10.7 C 75.4 10.7 75.1 11 75.2 11.4 L 78.3 22.5 L 75.4 26.6 C 75.2 26.9 75.4 27.3 75.7 27.3 L 79.2 27.3 C 79.6 27.3 79.9 27.1 80.1 26.8 L 90.2 11.4 C 90.4 11.1 90.2 10.7 89.9 10.7 Z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-500">Secure online payment</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="rounded-full w-5 h-5 border-2 border-indigo-500 flex items-center justify-center">
                          <div className="rounded-full w-2 h-2 bg-indigo-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep('selectPackage')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-[#0070ba] hover:bg-[#005ea6]"
                    onClick={handleBuyCredits}
                  >
                    <span className="mr-2">Pay with</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="15" viewBox="0 0 100 32">
                      <path fill="#ffffff" d="M 11.3 2.5 L 4.1 2.5 C 3.6 2.5 3.2 2.9 3.1 3.4 L 0.1 23.9 C 0 24.2 0.2 24.5 0.5 24.5 L 4 24.5 C 4.5 24.5 4.9 24.1 5 23.6 L 5.8 18.3 C 5.9 17.8 6.3 17.4 6.8 17.4 L 9.3 17.4 C 13.8 17.4 16.4 15.1 17.2 10.9 C 17.5 9 17.3 7.6 16.5 6.5 C 15.7 5.3 13.8 4.5 11.3 4.5 L 11.3 2.5 Z M 12.2 11.1 C 11.8 13.5 9.9 13.5 8.1 13.5 L 7 13.5 L 7.8 8.2 C 7.8 7.9 8.1 7.7 8.4 7.7 L 8.9 7.7 C 10.1 7.7 11.3 7.7 11.9 8.4.4 C 12.3 9 12.4 9.8 12.2 11.1 Z"/>
                      <path fill="#ffffff" d="M 35.2 11.1 L 31.8 11.1 C 31.5 11.1 31.2 11.3 31.2 11.6 L 31 12.9 L 30.8 12.6 C 30.1 11.5 28.6 11.1 27.1 11.1 C 23.8 11.1 21 13.7 20.4 17.4 C 20 19.3 20.4 21.1 21.4 22.3 C 22.3 23.5 23.7 24 25.3 24 C 28 24 29.4 22.2 29.4 22.2 L 29.2 23.5 C 29.1 23.8 29.3 24.1 29.6 24.1 L 32.7 24.1 C 33.2 24.1 33.6 23.7 33.7 23.2 L 35.6 11.6 C 35.7 11.3 35.5 11.1 35.2 11.1 Z M 30.4 17.5 C 30 19.3 28.6 20.5 26.8 20.5 C 25.9 20.5 25.2 20.2 24.7 19.7 C 24.3 19.2 24.1 18.4 24.3 17.5 C 24.6 15.7 26.1 14.4 27.9 14.4 C 28.8 14.4 29.5 14.7 30 15.2 C 30.5 15.8 30.7 16.6 30.4 17.5 Z"/>
                      <path fill="#ffffff" d="M 55.2 11.1 L 51.7 11.1 C 51.4 11.1 51 11.3 50.9 11.6 L 47.3 23.6 C 47.2 23.9 47.4 24.1 47.7 24.1 L 49.9 24.1 C 50.2 24.1 50.6 23.9 50.7 23.6 L 51.7 17.4 C 51.8 16.9 52.2 16.5 52.7 16.5 L 54.5 16.5 C 58.9 16.5 61.5 14.2 62.3 10 C 62.6 8.1 62.4 6.7 61.6 5.6 C 60.8 4.5 59 3.6 56.5 3.6 L 50.6 3.6 C 50.1 3.6 49.7 4 49.6 4.5 L 46.6 23.5 C 46.5 23.8 46.7 24.1 47 24.1 L 50.5 24.1 C 51 24.1 51.4 23.7 51.5 23.2 L 52.4 17.7 C 52.5 17.2 52.9 16.8 53.4 16.8 L 55 16.8 C 59.4 16.8 62 14.5 62.8 10.3 C 63.1 8.4 62.9 7 62.1 5.9 C 61.3 4.7 59.5 3.9 57 3.9 L 51.1 3.9 C 50.6 3.9 50.2 4.3 50.1 4.8 L 47.1 23.8 C 47 24.1 47.2 24.4 47.5 24.4 L 51 24.4 C 51.5 24.4 51.9 24 52 23.5 L 55.6 11.5 C 55.7 11.3 55.5 11.1 55.2 11.1 Z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </>
          )}

          {checkoutStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
              <h3 className="text-xl font-semibold mb-2">Processing Your Payment</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                Please wait while we process your payment with PayPal.
              </p>
              <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Package:</span>
                  <span className="font-medium">{CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                  <span className="font-medium">{CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">${CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {checkoutStep !== 'processing' && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              By purchasing, you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
