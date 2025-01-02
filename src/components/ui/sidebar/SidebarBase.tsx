import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import type { SidebarProps } from "./types";

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            side={side}
            className="w-[var(--sidebar-width)] bg-card p-0 [&>button]:hidden"
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group peer hidden md:block",
          "transition-all duration-300 ease-in-out",
          className
        )}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            "fixed inset-y-0 z-30 flex h-screen transition-all duration-300 ease-in-out",
            side === "left" ? "left-0" : "right-0",
            state === "expanded" 
              ? "w-[var(--sidebar-width)]" 
              : "w-[var(--sidebar-width-collapsed)]",
            variant === "floating" && "m-4",
            variant === "floating" && "rounded-xl border shadow-lg"
          )}
        >
          <div className="flex h-full w-full flex-col bg-card">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";