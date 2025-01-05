import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmAlert, setShowEmailConfirmAlert] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setShowEmailConfirmAlert(false);
      
      // Normalize email
      const email = values.email.toLowerCase().trim();
      console.log('Attempting login with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: values.password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);

        if (error.message.includes('Email not confirmed')) {
          setShowEmailConfirmAlert(true);
          return;
        }

        // Show specific error message for invalid credentials
        if (error.message.includes('Invalid login credentials')) {
          toast.error('The email or password you entered is incorrect');
          return;
        }

        // Generic error message for other cases
        toast.error('Login failed. Please try again.');
        return;
      }

      if (data?.user) {
        console.log('Login successful for user:', data.user.email);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        console.error('No user data received');
        toast.error('Login failed - please try again');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-8 py-12 bg-card rounded-xl shadow-lg animate-fade-up">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-accent">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}