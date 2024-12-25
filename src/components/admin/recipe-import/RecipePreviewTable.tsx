import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecipePreviewTableProps {
  recipes: any[];
}

const RecipePreviewTable = ({ recipes }: RecipePreviewTableProps) => {
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleImport = async () => {
    try {
      for (const recipe of recipes) {
        const categoryId = selectedCategories[recipe.id];
        if (!categoryId) {
          toast.error(`Please select a category for recipe: ${recipe.title}`);
          return;
        }

        const { error } = await supabase.from("recipes").insert({
          title: recipe.title,
          content: recipe.description,
          image_url: recipe.image,
          category_id: categoryId,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          author: "Imported Recipe",
        });

        if (error) throw error;
      }

      toast.success("Recipes imported successfully");
      navigate("/dashboard/staff");
    } catch (error) {
      console.error('Error importing recipes:', error);
      toast.error("Failed to import recipes");
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell>{recipe.title}</TableCell>
              <TableCell>
                <Select
                  value={selectedCategories[recipe.id]}
                  onValueChange={(value) =>
                    setSelectedCategories((prev) => ({
                      ...prev,
                      [recipe.id]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button onClick={handleImport}>
          Import Selected Recipes
        </Button>
      </div>
    </div>
  );
};

export default RecipePreviewTable;