import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { CategoryFormData } from '../types/category';

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export const CategoryForm = ({ onSubmit }: CategoryFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  const handleSubmit = async () => {
    await onSubmit(formData);
    setFormData({ name: '', description: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum Categories</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="outline"
        >
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'New Category'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 space-y-4">
          <Input
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Category
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};