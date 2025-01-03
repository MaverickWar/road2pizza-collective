import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ListEditorProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  disabled?: boolean; // Added disabled prop
}

const ListEditor = ({ title, items, onChange, placeholder, disabled }: ListEditorProps) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => onChange([...items, ""]);
  
  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>{title}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={disabled}
            >
              ×
            </Button>
          </div>
        ))}
        <Button onClick={addItem} variant="outline" size="sm" disabled={disabled}>
          Add {title.slice(0, -1)}
        </Button>
      </div>
    </div>
  );
};

export default ListEditor;