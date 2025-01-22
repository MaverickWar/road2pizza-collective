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

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center bg-[#FFF8F3] px-4 py-8">
        <div className="w-full max-w-sm space-y-4 bg-white rounded-xl shadow-lg p-6 border border-orange-100">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-600">
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
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email" 
                        className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400"
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
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400"
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="space-y-2 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/signup')} 
              className="text-sm text-orange-600 hover:text-orange-700"
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
                className="text-sm text-orange-600 hover:text-orange-700"
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