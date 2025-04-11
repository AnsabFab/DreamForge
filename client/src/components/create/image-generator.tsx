import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Sparkles, Image as ImageIcon, Loader2, Wand2, Palette, Braces, Share2, Lock, ImagePlus, Dices } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  modelId: z.number({
    required_error: "Please select a model",
  }),
  styleId: z.number().optional(),
  isPublic: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// Example prompt suggestions
const PROMPT_SUGGESTIONS = [
  "A cyberpunk city at night with neon lights and flying cars",
  "A serene landscape with mountains, a lake, and autumn trees",
  "A fantasy castle floating in the clouds with rainbow bridges",
  "A mystical forest with glowing plants and magical creatures",
  "An astronaut riding a horse on Mars, photorealistic",
  "A futuristic robot in a traditional Japanese garden",
];

export function ImageGenerator() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");

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
      isPublic: true, // Default to public sharing
    },
  });

  // Random prompt suggestion
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * PROMPT_SUGGESTIONS.length);
    form.setValue("prompt", PROMPT_SUGGESTIONS[randomIndex]);
  };

  // Image generation mutation
  const generateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsGenerating(true);
      simulateProgress();
      const res = await apiRequest("POST", "/api/images/generate", values);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Image generated successfully!",
        description: "Your creation is ready to view.",
      });
      // Set the generated image for display
      setGeneratedImage(data.imageUrl);
      // Switch to view tab
      setActiveTab("view");
      // Invalidate recent images query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/images/recent"] });
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

    setGeneratedImage(null); // Clear previous image
    generateMutation.mutate(values);
  }

  // Reset form and go back to create tab
  const handleCreateNew = () => {
    form.reset({ 
      prompt: "", 
      modelId: 2, 
      styleId: undefined,
      isPublic: true 
    });
    setActiveTab("create");
  };

  return (
    <Card className="shadow-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 mb-8 border-0 ring-1 ring-slate-700">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            DreamCraft Studio
          </h2>
          <div className="flex items-center space-x-2 text-white text-sm">
            <span className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <ImageIcon className="h-4 w-4 mr-1" />
              {user?.credits || 0} credits
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none bg-slate-800/50">
            <TabsTrigger value="create" className="data-[state=active]:bg-slate-700 py-3">
              <ImagePlus className="h-4 w-4 mr-2" />
              Text to Image
            </TabsTrigger>
            <TabsTrigger value="ghibli" className="data-[state=active]:bg-slate-700 py-3">
              <Wand2 className="h-4 w-4 mr-2" />
              Ghibli Style
            </TabsTrigger>
            <TabsTrigger value="view" className="data-[state=active]:bg-slate-700 py-3" disabled={!generatedImage}>
              <ImageIcon className="h-4 w-4 mr-2" />
              View Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ghibli" className="p-0 m-0">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Ghibli Style Transfer</h3>
                <p className="text-slate-400">Transform your images into charming Ghibli-style artwork</p>
              </div>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="ghibli-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload
                    }
                  }}
                />
                <label htmlFor="ghibli-upload" className="cursor-pointer">
                  <div className="mb-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-slate-500" />
                  </div>
                  <p className="text-slate-300 mb-2">Click to upload your image</p>
                  <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                </label>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 h-12"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Transform to Ghibli Style (5 credits)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="create" className="p-0 m-0">
            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-white flex items-center">
                            <Braces className="h-4 w-4 mr-2 text-indigo-400" />
                            Your Prompt
                          </FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={getRandomPrompt}
                                  className="text-xs text-indigo-300 hover:text-indigo-200 h-7"
                                >
                                  <Dices className="h-3 w-3 mr-1" />
                                  Inspire me
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Get a random prompt suggestion</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your dream image in detail..." 
                            rows={3}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-indigo-500 resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="styleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <Palette className="h-4 w-4 mr-2 text-indigo-400" />
                            Style
                          </FormLabel>
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
                            <FormLabel className="text-white flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-indigo-400" />
                              Model
                            </FormLabel>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          />
                        </FormControl>
                        <div className="pt-1 space-y-1 leading-none">
                          <FormLabel className="text-white flex items-center">
                            {field.value ? (
                              <Share2 className="h-4 w-4 mr-2 text-indigo-400" />
                            ) : (
                              <Lock className="h-4 w-4 mr-2 text-indigo-400" />
                            )}
                            Share to public gallery
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {isGenerating ? (
                    <div className="mt-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Creating your masterpiece</h3>
                      <p className="text-slate-300 mb-2">
                        This may take a moment as our AI crafts your vision...
                      </p>
                      <Progress value={progress} className="w-full h-2 mb-4" />
                      <p className="text-sm text-slate-400">
                        Processing prompt: "{form.getValues().prompt}"
                      </p>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 h-12 mt-4"
                      disabled={generateMutation.isPending}
                    >
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate ({creditCost} credits)
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="view" className="p-0 m-0">
            {generatedImage && (
              <div className="p-6 space-y-4">
                <div className="relative rounded-md overflow-hidden">
                  <img 
                    src={generatedImage} 
                    alt="Generated image" 
                    className="w-full h-auto object-contain rounded-md shadow-lg" 
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
                  <Button
                    onClick={handleCreateNew}
                    className="bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Create New Image
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-none"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="mt-3 bg-slate-800 rounded-md p-3">
                  <h4 className="text-slate-300 text-sm font-medium mb-1">Prompt</h4>
                  <p className="text-white text-sm">{form.getValues().prompt}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
