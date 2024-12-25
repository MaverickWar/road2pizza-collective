import { useState } from "react";
import { useToast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import RecipePreviewTable from "./RecipePreviewTable";

export const RecipeImportForm = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedRecipes, setScrapedRecipes] = useState<any[]>([]);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Scraping recipe from URL:', url);
      const { data, error } = await supabase.functions.invoke('scrape-recipe', {
        body: { url }
      });

      if (error) throw error;

      console.log('Scraped recipe data:', data);
      setScrapedRecipes([data]);
      toast.success("Recipe scraped successfully");
    } catch (error) {
      console.error('Error scraping recipe:', error);
      toast.error("Failed to scrape recipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            Recipe URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            required
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            "Import Recipe"
          )}
        </Button>

        {scrapedRecipes.length > 0 && (
          <RecipePreviewTable recipes={scrapedRecipes} />
        )}
      </form>
    </Card>
  );
};