
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListEditorProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const ListEditor = ({ 
  title, 
  items, 
  onChange, 
  placeholder = "Add item", 
  disabled = false,
  error
}: ListEditorProps) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...items, newItem.trim()];
      console.log('Adding item:', { newItem, items, updatedItems });
      onChange(updatedItems);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    console.log('Removing item:', { index, updatedItems });
    onChange(updatedItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-md border border-gray-100">
      <Label className="text-sm font-medium text-gray-900">
        {title}
      </Label>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              error && "border-destructive",
              "focus:ring-2 focus:ring-offset-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${title}-error` : undefined}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          disabled={disabled || !newItem.trim()}
          className={cn(
            "min-w-[80px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {error && (
        <p 
          id={`${title}-error`}
          className="text-sm text-destructive font-medium"
        >
          {error}
        </p>
      )}

      {items.length > 0 ? (
        <div className="space-y-2 mt-4">
          <Label className="text-sm font-medium">
            {title} ({items.length})
          </Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded-md bg-white">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-md bg-muted group hover:bg-muted/80 transition-colors"
              >
                <span className="flex-1 text-sm break-words">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={disabled}
                  className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ListEditor;
