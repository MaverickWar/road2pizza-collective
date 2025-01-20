import { cn } from "@/lib/utils";

interface FormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function FormLayout({ children, className }: FormLayoutProps) {
  return (
    <div className={cn("space-y-6 py-4", className)}>
      {children}
    </div>
  );
}

export function FormSection({ children, className }: FormLayoutProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

export function FormActions({ children, className }: FormLayoutProps) {
  return (
    <div className={cn("flex justify-end gap-3 pt-4", className)}>
      {children}
    </div>
  );
}