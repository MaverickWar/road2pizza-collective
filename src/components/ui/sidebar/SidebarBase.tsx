import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position?: 'left' | 'right';
  panelId: string;
}

export const SidebarBase = ({ 
  children, 
  position = 'left',
  panelId,
  className,
  ...props 
}: SidebarBaseProps) => {
  const uniquePanelId = `${panelId}-${position}`;
  
  return (
    <div
      className={cn(
        "relative flex flex-grow flex-col",
        position === 'left' ? 'pl-2' : 'pr-2',
        className
      )}
      id={uniquePanelId}
      data-panel=""
      data-panel-group-id={`:r${uniquePanelId}`}
      data-panel-id={uniquePanelId}
      aria-label={`${position} sidebar panel`}
      role="complementary"
      {...props}
    >
      {children}
    </div>
  );
};