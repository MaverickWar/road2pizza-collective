import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeData } from "@/types/theme";

interface ThemeListProps {
  themes: ThemeData[];
  onActivate: (themeId: string) => Promise<void>;
  onEdit: (themeId: string) => void;
}

export function ThemeList({ themes, onActivate, onEdit }: ThemeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {themes?.map((theme) => (
        <Card key={theme.id} className={theme.is_active ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{theme.name}</span>
              {!theme.is_active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onActivate(theme.id)}
                >
                  Activate
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onEdit(theme.id)}
            >
              Edit Theme
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}