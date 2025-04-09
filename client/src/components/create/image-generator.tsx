import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2, Wand2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { StyleSelector } from "./style-selector";
import { ModelSelector } from "./model-selector";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Model, Style } from "@shared/schema";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  modelId: z.number({
    required_error: "Please select a model",
  }),
  styleId: z.number().optional(),
  isPublic: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function ImageGenerator() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch models
  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  // Fetch styles
  const { data: styles = [] } = useQuery<Style[]>({
    queryKey: ["/api/styles"],
  });

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      modelId: 2, // Default to SDXL
      isPublic: false,
    },
  });

  // Image generation mutation
  const generateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsGenerating(true);
      simulateProgress();
      const res = await apiRequest("POST", "/api/images/generate", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Image generated successfully!",
        description: "Check your recent creations below.",
      });
      // Invalidate recent images query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/images/recent"] });
      // Reset form
      form.reset({ prompt: "", modelId: 2, isPublic: false });
      setIsGenerating(false);
      setProgress(100);
      // Reset progress after showing 100%
      setTimeout(() => setProgress(0), 1000);
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
      setProgress(0);
    },
  });

  // Simulate progress for UX
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  // Get selected model name and cost
  const selectedModel = form.watch("modelId");
  const modelInfo = models.find((m) => m.id === selectedModel);
  const creditCost = modelInfo?.creditCost || 0;

  function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to generate images.",
        variant: "destructive",
      });
      return;
    }

    if ((user.credits || 0) < creditCost) {
      toast({
        title: "Not enough credits",
        description: `You need ${creditCost} credits to use this model.`,
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate(values);
  }

  return (
    <Card className="shadow-lg overflow-hidden bg-white dark:bg-gray-800 mb-8 transition-colors">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Create Your Image</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you want to create..." 
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="styleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <FormControl>
                    <StyleSelector 
                      styles={styles} 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Model</FormLabel>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Higher quality = more credits
                    </span>
                  </div>
                  <FormControl>
                    <ModelSelector 
                      models={models} 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="pt-1 space-y-1 leading-none">
                    <FormLabel>Share to public gallery</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {isGenerating ? (
              <div className="mt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Creating your image</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  This may take up to 30 seconds...
                </p>
                <Progress value={progress} className="w-full h-2 mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Processing prompt: "{form.getValues().prompt}"
                </p>
              </div>
            ) : (
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
                disabled={generateMutation.isPending}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Image ({creditCost} credits)
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
