import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signupFormSchema } from '@/types/auth';
import { useSignup } from '@/hooks/useSignup';
import MainLayout from '@/components/MainLayout';

export default function Signup() {
  const navigate = useNavigate();
  const { 
    isLoading, 
    showEmailConfirmAlert, 
    handleSignup
  } = useSignup();

  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: ''
    },
  });

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 px-8 py-12 bg-card rounded-xl shadow-lg animate-fade-up">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-accent">Join Road2Pizza</h1>
            <p className="text-sm text-muted-foreground">
              Create your account to get started
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
            <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        placeholder="Choose a username" 
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
                        placeholder="Create a password" 
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
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
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/login')} 
              className="text-accent hover:text-accent/90"
              disabled={isLoading}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}