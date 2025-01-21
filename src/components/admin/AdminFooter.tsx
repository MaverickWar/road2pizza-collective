import { memo } from "react";

export const AdminFooter = memo(() => {
  console.log("AdminFooter rendered");
  
  return (
    <footer className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] py-4 text-white text-center mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          Designed & Created by Richard Giles | © Road2Pizza.com
        </p>
      </div>
    </footer>
  );
});

AdminFooter.displayName = "AdminFooter";