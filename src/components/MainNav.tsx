const MainNav = () => {
  // ... existing code ...

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation - More visible trigger */}
            <div className="block md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="flex items-center justify-center hover:bg-accent/10 active:bg-accent/20"
                  >
                    <Menu className="h-6 w-6 text-accent" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-[300px] top-[7rem] h-[calc(100vh-7rem)] border-t-0"
                >
                  {/* ... existing sheet content ... */}
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* ... existing logo content ... */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* ... existing desktop navigation ... */}
          </div>
        </div>
      </div>
    </nav>
  );
};
