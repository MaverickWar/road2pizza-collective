import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormFields from "./form/FormFields";
import ListEditor from "@/components/article/edit/ListEditor";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
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

    const errors = form.formState.errors;
    const hasErrors = Object.keys(errors).length > 0;

    const renderErrors = () => {
      if (!hasErrors) return null;

      const currentFields = {
        1: ["title", "content", "image_url"],
        2: ["ingredients"],
        3: ["instructions"],
        4: ["tips"],
      }[currentStep];

      const currentErrors = Object.entries(errors)
        .filter(([key]) => currentFields?.includes(key))
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

    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            {renderErrors()}
            <FormFields
              form={form}
              disabled={loading}
            />
          </Card>
        );
      case 2:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
            {renderErrors()}
            <p className="text-sm text-muted-foreground mb-4">
              List all ingredients needed for your recipe. Be specific with quantities and measurements.
            </p>
            <ListEditor
              title="Recipe Ingredients"
              items={form.getValues("ingredients")}
              onChange={(items) => form.setValue("ingredients", items)}
              placeholder="Add ingredient (e.g., 2 cups flour)"
              disabled={loading}
              error={errors.ingredients?.message}
            />
          </Card>
        );
      case 3:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            {renderErrors()}
            <p className="text-sm text-muted-foreground mb-4">
              Break down your recipe into clear, step-by-step instructions.
            </p>
            <ListEditor
              title="Step-by-Step Instructions"
              items={form.getValues("instructions")}
              onChange={(items) => form.setValue("instructions", items)}
              placeholder="Add instruction step"
              disabled={loading}
              error={errors.instructions?.message}
            />
          </Card>
        );
      case 4:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
            {renderErrors()}
            <p className="text-sm text-muted-foreground mb-4">
              Share your expert tips to help others make this recipe successfully.
            </p>
            <ListEditor
              title="Helpful Tips"
              items={form.getValues("tips")}
              onChange={(items) => form.setValue("tips", items)}
              placeholder="Add a pro tip"
              disabled={loading}
              error={errors.tips?.message}
            />
          </Card>
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            {submissionSuccess ? (
              "Submission Complete"
            ) : (
              <>
                Submit Recipe for {pizzaTypeName}
                <span className="text-sm font-normal text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </>
            )}
          </DialogTitle>
          {!submissionSuccess && <Progress value={progress} className="h-2 mt-4" />}
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-12rem)] px-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            {renderStepContent()}
          </form>
        </ScrollArea>

        {!submissionSuccess && (
          <div className="p-6 pt-0 border-t bg-muted/50 flex justify-between">
            <Button 
              type="button"
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              Previous
            </Button>
            <div className="flex gap-2">
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
                  className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Recipe"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  disabled={loading}
                  className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSubmissionDialog; 