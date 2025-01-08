import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LoginFormValues } from '@/types/auth';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmAlert, setShowEmailConfirmAlert] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleForgotPassword = async (email: string) => {
    try {
      setIsSendingReset(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error('Failed to send reset email. Please try again.');
        return;
      }

      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setShowEmailConfirmAlert(false);
      
      const email = values.email.toLowerCase().trim();
      const { password } = values;
      
      console.log('Starting login attempt...', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);

        if (error.message.includes('Email not confirmed')) {
          setShowEmailConfirmAlert(true);
          return;
        }

        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.');
          return;
        }

        toast.error('Login failed. Please try again.');
        return;
      }

      if (data?.user) {
        console.log('Login successful:', {
          id: data.user.id,
          email: data.user.email,
          lastSignIn: data.user.last_sign_in_at
        });
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        console.error('No user data received from successful login');
        toast.error('Login failed - please try again');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showEmailConfirmAlert,
    isSendingReset,
    handleLogin,
    handleForgotPassword
  };
};