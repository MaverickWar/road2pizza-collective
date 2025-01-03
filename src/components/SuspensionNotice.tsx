import { AlertCircle } from "lucide-react";
import Navigation from "./Navigation";

const SuspensionNotice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-32">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-medium text-textLight">Account Suspended</h1>
          <p className="text-lg text-gray-600">
            Your account has been suspended. Please contact support for more information.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SuspensionNotice;