import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormFields from "./form/FormFields";
import ListEditor from "@/components/article/edit/ListEditor";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    video_url: "",
    video_provider: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    tips: [] as string[],
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "",
  });

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.content || !formData.image_url) {
          toast.error("Please fill in all required fields in Basic Information");
          return false;
        }
        return true;
      case 2:
        if (!formData.ingredients.length) {
          toast.error("Please add at least one ingredient");
          return false;
        }
        return true;
      case 3:
        if (!formData.instructions.length) {
          toast.error("Please add at least one instruction step");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a recipe");
      return;
    }

    // Validate all steps before submission
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    try {
      setLoading(true);
      console.log("Starting recipe submission...");

      // Submit recipe
      const { data, error } = await supabase
        .from("recipes")
        .insert([{
          ...formData,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
          status: 'pending',
          approval_status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Recipe submitted successfully:", data);
      setSubmittedRecipeId(data.id);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    setFormData(prev => ({ 
      ...prev, 
      video_url: url,
      video_provider: provider 
    }));
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
    // Reset form state
    setFormData({
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
    });
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

    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <FormFields
              formData={formData}
              onChange={handleFieldChange}
              onImageUploaded={(url) => handleFieldChange('image_url', url)}
              onVideoUrlChange={handleVideoUrlChange}
              disabled={loading}
            />
          </Card>
        );
      case 2:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
            <p className="text-sm text-muted-foreground mb-4">
              List all ingredients needed for your recipe. Be specific with quantities and measurements.
            </p>
            <ListEditor
              title="Recipe Ingredients"
              items={formData.ingredients}
              onChange={(items) => setFormData(prev => ({ ...prev, ingredients: items }))}
              placeholder="Add ingredient (e.g., 2 cups flour)"
              disabled={loading}
            />
          </Card>
        );
      case 3:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Break down your recipe into clear, step-by-step instructions.
            </p>
            <ListEditor
              title="Step-by-Step Instructions"
              items={formData.instructions}
              onChange={(items) => setFormData(prev => ({ ...prev, instructions: items }))}
              placeholder="Add instruction step"
              disabled={loading}
            />
          </Card>
        );
      case 4:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your expert tips to help others make this recipe successfully.
            </p>
            <ListEditor
              title="Helpful Tips"
              items={formData.tips}
              onChange={(items) => setFormData(prev => ({ ...prev, tips: items }))}
              placeholder="Add a pro tip"
              disabled={loading}
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
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
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
                  onClick={handleSubmit}
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