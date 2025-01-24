import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SignupFormValues } from '@/types/auth';
import type { GetAuthConfigResponse } from '@/types/auth';

export const useSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmAlert, setShowEmailConfirmAlert] = useState(false);

  const handleSignup = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setShowEmailConfirmAlert(false);
      
      const email = values.email.toLowerCase().trim();
      const { password, username } = values;
      
      console.log('Starting signup attempt...', { email, username });

      // First check if email already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUsers) {
        toast.error('An account with this email already exists. Please sign in instead.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data?.user) {
        console.log('Signup successful:', {
          id: data.user.id,
          email: data.user.email,
        });
        
        // Check if email confirmation is required
        const { data: authConfigData } = await supabase.rpc<GetAuthConfigResponse>('get_auth_config');
        const requiresEmailConfirmation = authConfigData?.confirmations_required ?? false;

        if (requiresEmailConfirmation) {
          toast.success('Account created! Please check your email to confirm your account.');
          setShowEmailConfirmAlert(true);
        } else {
          // If no email confirmation required, log the user in
          toast.success('Account created successfully! Welcome to Road2Pizza!');
          
          // Send welcome email via edge function
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: { email, username }
            });
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
          }

          navigate('/dashboard');
        }
      } else {
        console.error('No user data received from successful signup');
        toast.error('Signup failed - please try again');
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showEmailConfirmAlert,
    handleSignup
  };
};