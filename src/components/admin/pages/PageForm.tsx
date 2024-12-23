import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { PageFormFields } from "./form/PageFormFields";
import { pageFormSchema, type PageFormValues, type Page } from "./form/types";

interface PageFormProps {
  onClose: () => void;
  page?: Page;
}

const PageForm = ({ onClose, page }: PageFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: page || {
      title: "",
      slug: "",
      content: "",
      is_protected: false,
      required_role: "member",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: PageFormValues) => {
      console.log("Saving page:", values);
      if (!user?.id) throw new Error("User not authenticated");

      const pageData = {
        ...values,
        title: values.title,
        slug: values.slug,
        updated_by: user.id,
        ...(page ? {} : { created_by: user.id }),
      };

      const { data, error } = page?.id
        ? await supabase
            .from("pages")
            .update(pageData)
            .eq("id", page.id)
            .select()
            .single()
        : await supabase
            .from("pages")
            .insert(pageData)
            .select()
            .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success(page ? "Page updated successfully" : "Page created successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    },
  });

  const onSubmit = (values: PageFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PageFormFields form={form} />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {page ? "Update Page" : "Create Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PageForm;