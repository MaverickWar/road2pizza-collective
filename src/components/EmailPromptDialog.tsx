import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormLayout, FormSection, FormActions } from "@/components/ui/form-layout";

interface EmailPromptDialogProps {
  open: boolean;
  userId: string;
  onEmailSet: () => void;
}

const EmailPromptDialog = ({ open, userId, onEmailSet }: EmailPromptDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Updating email for user:", userId);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ email })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success("Email updated successfully");
      onEmailSet();
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-background border-0 shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Email Required</DialogTitle>
        </DialogHeader>
        <FormLayout>
          <FormSection>
            <Label htmlFor="email" className="text-sm font-medium leading-none">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              className="w-full"
            />
          </FormSection>
          <FormActions>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Email"}
            </Button>
          </FormActions>
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPromptDialog;