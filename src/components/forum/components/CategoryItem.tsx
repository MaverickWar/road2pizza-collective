import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '../types/category';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface CategoryItemProps {
  category: Category;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
}

export function CategoryItem({ category, onUpdate, onDelete }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');

  const handleSave = () => {
    onUpdate(category.id, { name, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(category.name);
    setDescription(category.description || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category Description"
              rows={2}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm" className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex items-center">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="flex items-center"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDelete(category.id)}
                variant="ghost"
                size="sm"
                className="flex items-center text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}