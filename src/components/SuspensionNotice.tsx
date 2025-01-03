import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SuspensionNotice = () => {
  return (
    <main className="container mx-auto px-4 py-32">
      <div className="max-w-md mx-auto">
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Suspended</AlertTitle>
          <AlertDescription>
            Your account has been suspended. Please contact support for more information.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
};

export default SuspensionNotice;