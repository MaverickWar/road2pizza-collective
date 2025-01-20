import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginFormSchema } from '@/types/auth';
import { useLogin } from '@/hooks/useLogin';
import MainLayout from '@/components/MainLayout';

export default function Login() {
  console.log('[Login] Rendering Login page');
  
  const navigate = useNavigate();
  const { 
    isLoading, 
    showEmailConfirmAlert, 
    isSendingReset, 
    handleLogin, 
    handleForgotPassword 
  } = useLogin();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  console.log('[Login] Form state:', { 
    isLoading, 
    showEmailConfirmAlert,
    isSendingReset,
    formErrors: form.formState.errors,
    isDirty: form.formState.isDirty,
    currentPath: window.location.pathname
  });

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background pt-[5rem]">
        <div className="w-full max-w-md space-y-8 px-8 py-12 bg-card rounded-xl shadow-lg animate-fade-up z-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-accent">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          {showEmailConfirmAlert && (
            <Alert>
              <AlertDescription>
                Please check your email to confirm your account before logging in.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email" 
                        className="bg-background border-input focus:border-accent" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-background border-input focus:border-accent"
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-4">
            <Button 
              variant="link" 
              onClick={() => navigate('/signup')} 
              className="text-accent hover:text-accent/90"
              disabled={isLoading}
            >
              Don't have an account? Sign up
            </Button>
            <div>
              <Button
                variant="link"
                onClick={() => {
                  const email = form.getValues('email');
                  if (!email) {
                    toast.error('Please enter your email address first');
                    return;
                  }
                  handleForgotPassword(email);
                }}
                className="text-accent hover:text-accent/90"
                disabled={isSendingReset || isLoading}
              >
                {isSendingReset ? 'Sending reset email...' : 'Forgot your password?'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}