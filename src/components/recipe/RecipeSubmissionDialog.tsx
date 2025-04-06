import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormFields from "./form/FormFields";
import ListEditor from "@/components/article/edit/ListEditor";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, CheckCircle2, AlertCircle, ChevronLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  image_url: z.string().min(1, "Image is required"),
  video_url: z.string().optional(),
  video_provider: z.string().optional(),
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
  instructions: z.array(z.string()).min(1, "At least one instruction step is required"),
  tips: z.array(z.string()).optional(),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pizzaTypeId?: string;
  pizzaTypeName?: string;
}

const RecipeSubmissionDialog = ({ 
  isOpen, 
  onClose, 
  pizzaTypeId,
  pizzaTypeName 
}: RecipeSubmissionDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedRecipeId, setSubmittedRecipeId] = useState<string | null>(null);
  const totalSteps = 4;

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
      video_url: "",
      video_provider: "",
      ingredients: [],
      instructions: [],
      tips: [],
      prep_time: "",
      cook_time: "",
      servings: "",
      difficulty: "",
    },
  });

  const formErrors = form.formState.errors;

  const renderErrors = () => {
    const currentFields = {
      1: ["title", "content", "image_url"],
      2: ["ingredients"],
      3: ["instructions"],
      4: ["tips"],
    }[currentStep];

    if (!currentFields) return null;

    const currentErrors = Object.entries(formErrors)
      .filter(([key]) => currentFields.includes(key))
      .map(([_, error]) => error.message);

    if (currentErrors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {currentErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </AlertDescription>
      </Alert>
    );
  };

  const validateStep = (step: number) => {
    const fields = {
      1: ["title", "content", "image_url"],
      2: ["ingredients"],
      3: ["instructions"],
      4: ["tips"],
    } as const;

    const currentFields = fields[step as keyof typeof fields];
    let isValid = true;

    currentFields.forEach((field) => {
      try {
        recipeSchema.shape[field].parse(form.getValues(field as keyof RecipeFormData));
      } catch (error) {
        isValid = false;
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            form.setError(field as keyof RecipeFormData, {
              type: "manual",
              message: err.message,
            });
          });
        }
      }
    });

    return isValid;
  };

  const handleSubmit = async (data: RecipeFormData) => {
    if (!user) {
      toast.error("Please login to submit a recipe");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting recipe submission...");

      // Submit recipe
      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert([{
          title: data.title,
          content: data.content,
          image_url: data.image_url,
          video_url: data.video_url || null,
          video_provider: data.video_provider || null,
          ingredients: data.ingredients,
          instructions: data.instructions,
          tips: data.tips || [],
          prep_time: data.prep_time || null,
          cook_time: data.cook_time || null,
          servings: data.servings || null,
          difficulty: data.difficulty || null,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
          status: 'pending',
          approval_status: 'pending',
          edit_requires_approval: true,
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Recipe submitted successfully:", recipe);
      setSubmittedRecipeId(recipe.id);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setSubmissionSuccess(false);
    setSubmittedRecipeId(null);
    onClose();
  };

  const renderStepContent = () => {
    if (submissionSuccess) {
      return (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-green-600">Recipe Submitted Successfully!</h3>
            <p className="text-muted-foreground">
              Your recipe has been submitted and is pending review by our team.
              You can track its status in your dashboard.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  navigate('/dashboard', { 
                    state: { 
                      showRecipeStatus: true,
                      recipeId: submittedRecipeId 
                    }
                  });
                }}
                className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold"
              >
                View in Dashboard
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <>
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Start with the essential details of your recipe.
              </p>
            </div>
            {renderErrors()}
            <Card className="p-6">
              <FormFields
                form={form}
                disabled={loading}
              />
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                List all ingredients needed for your recipe. Be specific with quantities and measurements.
              </p>
            </div>
            {renderErrors()}
            <Card className="p-6">
              <ListEditor
                title="Ingredients List"
                items={form.getValues("ingredients")}
                onChange={(items) => form.setValue("ingredients", items)}
                placeholder="Add ingredient (e.g., 2 cups flour)"
                disabled={loading}
                error={formErrors.ingredients?.message}
              />
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Cooking Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Break down your recipe into clear, step-by-step instructions.
              </p>
            </div>
            {renderErrors()}
            <Card className="p-6">
              <ListEditor
                title="Step-by-Step Instructions"
                items={form.getValues("instructions")}
                onChange={(items) => form.setValue("instructions", items)}
                placeholder="Add instruction step"
                disabled={loading}
                error={formErrors.instructions?.message}
              />
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Pro Tips & Final Details</h3>
              <p className="text-sm text-muted-foreground">
                Share your expert tips to help others make this recipe successfully.
              </p>
            </div>
            {renderErrors()}
            <Card className="p-6">
              <ListEditor
                title="Helpful Tips"
                items={form.getValues("tips")}
                onChange={(items) => form.setValue("tips", items)}
                placeholder="Add a pro tip"
                disabled={loading}
                error={formErrors.tips?.message}
              />
            </Card>
          </div>
        )}
      </>
    );
  };

  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-2xl font-semibold">
            {submissionSuccess ? (
              "Recipe Submitted Successfully!"
            ) : (
              <div className="space-y-1">
                <h2>Submit Recipe for {pizzaTypeName}</h2>
                <p className="text-base font-normal text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            )}
          </DialogTitle>
          {!submissionSuccess && (
            <div className="pt-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Recipe Ingredients"}
                {currentStep === 3 && "Cooking Instructions"}
                {currentStep === 4 && "Pro Tips & Final Details"}
              </div>
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-12rem)] px-6 py-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {submissionSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-semibold text-green-600">Recipe Submitted Successfully!</h3>
                  <p className="text-muted-foreground">
                    Your recipe has been submitted and is pending review by our team.
                    You can track its status in your dashboard.
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleClose();
                      navigate('/dashboard', { 
                        state: { 
                          showRecipeStatus: true,
                          recipeId: submittedRecipeId 
                        }
                      });
                    }}
                    className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold"
                  >
                    View in Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {renderStepContent()}
              </>
            )}
          </form>
        </ScrollArea>

        {!submissionSuccess && (
          <div className="p-6 border-t sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button 
                type="button"
                variant="ghost" 
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                {isLastStep ? (
                  <Button 
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={loading}
                    className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold min-w-[120px] gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Recipe
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    disabled={loading}
                    className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSubmissionDialog; 