import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Editor from '@/components/Editor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface EditRecipeModalProps {
  recipe: any;
  onClose: () => void;
}

const EditRecipeModal = ({ recipe, onClose }: EditRecipeModalProps) => {
  const [content, setContent] = React.useState(recipe.content || '');
  const [ingredients, setIngredients] = React.useState<string[]>(recipe.ingredients || []);
  const [instructions, setInstructions] = React.useState<string[]>(recipe.instructions || []);
  const [tips, setTips] = React.useState<string[]>(recipe.tips || []);
  const [prepTime, setPrepTime] = React.useState(recipe.prep_time || '');
  const [cookTime, setCookTime] = React.useState(recipe.cook_time || '');
  const [servings, setServings] = React.useState(recipe.servings || '');
  const [difficulty, setDifficulty] = React.useState(recipe.difficulty || '');
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...tips];
    newTips[index] = value;
    setTips(newTips);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const addTip = () => setTips([...tips, '']);
  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .update({
          content,
          ingredients,
          instructions,
          tips,
          prep_time: prepTime,
          cook_time: cookTime,
          servings,
          difficulty
        })
        .eq('id', recipe.id);

      if (error) throw error;

      toast.success('Recipe updated successfully');
      queryClient.invalidateQueries({ queryKey: ['article'] });
      onClose();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Recipe: {recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prep Time</Label>
              <Input 
                value={prepTime} 
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g., 30 minutes"
              />
            </div>
            <div>
              <Label>Cook Time</Label>
              <Input 
                value={cookTime} 
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="e.g., 1 hour"
              />
            </div>
            <div>
              <Label>Servings</Label>
              <Input 
                value={servings} 
                onChange={(e) => setServings(e.target.value)}
                placeholder="e.g., 4-6 servings"
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Input 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="e.g., Easy, Medium, Hard"
              />
            </div>
          </div>

          <div>
            <Label>Ingredients</Label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="Add ingredient"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button onClick={addIngredient} variant="outline" size="sm">
                Add Ingredient
              </Button>
            </div>
          </div>

          <div>
            <Label>Instructions</Label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder="Add instruction"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button onClick={addInstruction} variant="outline" size="sm">
                Add Instruction
              </Button>
            </div>
          </div>

          <div>
            <Label>Pro Tips</Label>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tip}
                    onChange={(e) => handleTipChange(index, e.target.value)}
                    placeholder="Add tip"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTip(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button onClick={addTip} variant="outline" size="sm">
                Add Tip
              </Button>
            </div>
          </div>

          <div>
            <Label>Recipe Content</Label>
            <Editor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeModal;