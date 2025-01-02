import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DifficultySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const DifficultySelect = ({ value, onValueChange, disabled }: DifficultySelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="easy">Easy</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="hard">Hard</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DifficultySelect;