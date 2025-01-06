import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SignupFormValues } from '@/types/auth';

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
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        console.log('Signup successful:', {
          id: data.user.id,
          email: data.user.email,
        });
        
        toast.success('Account created successfully! Please check your email to confirm your account.');
        setShowEmailConfirmAlert(true);
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