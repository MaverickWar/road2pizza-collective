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
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
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

  // Monitor API performance
  const trackLoginAttempt = async (success: boolean, duration: number, errorType?: string) => {
    try {
      const { error } = await supabase.from('analytics_metrics').insert({
        metric_name: success ? 'login_success' : 'login_error',
        metric_value: duration,
        metadata: {
          error_type: errorType,
          timestamp: new Date().toISOString()
        },
        http_status: success ? 200 : 400,
        endpoint_path: '/auth/login',
        response_time: duration
      });

      if (error) {
        console.error('Failed to track login metrics:', error);
      }
    } catch (err) {
      console.error('Error tracking login metrics:', err);
    }
  };

  // Wrap the original handleLogin with performance tracking
  const handleLoginWithTracking = async (values: any) => {
    const startTime = performance.now();
    try {
      await handleLogin(values);
      const duration = performance.now() - startTime;
      await trackLoginAttempt(true, duration);
    } catch (error: any) {
      const duration = performance.now() - startTime;
      await trackLoginAttempt(false, duration, error.message);
      throw error; // Re-throw to maintain original error handling
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background pt-[5rem]">
        <div className="w-full max-w-md space-y-8 px-8 py-12 bg-white rounded-xl shadow-admin animate-fade-up z-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-admin">Welcome back</h1>
            <p className="text-sm text-admin-muted">
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
            <form onSubmit={form.handleSubmit(handleLoginWithTracking)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-foreground">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email" 
                        className="bg-white border-admin-border focus:border-admin focus:ring-2 focus:ring-admin/20" 
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
                    <FormLabel className="text-admin-foreground">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-white border-admin-border focus:border-admin focus:ring-2 focus:ring-admin/20"
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
                className="w-full bg-admin hover:bg-admin-hover-DEFAULT text-white transition-colors"
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
              className="text-admin hover:text-admin-hover-DEFAULT"
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
                className="text-admin hover:text-admin-hover-DEFAULT"
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