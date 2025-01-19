import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LoginFormValues } from '@/types/auth';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmAlert, setShowEmailConfirmAlert] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const getErrorMessage = (error: AuthError) => {
    console.log('Auth error details:', {
      code: error.message,
      status: error.status,
      name: error.name
    });

    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Email not confirmed')) {
            return 'Please check your email to confirm your account before logging in.';
          }
          if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
          }
          if (error.message.includes('invalid_credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
          }
          return error.message;
        case 401:
          return 'Invalid credentials. Please check your email and password.';
        case 422:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many login attempts. Please try again later.';
        default:
          return 'An error occurred during login. Please try again.';
      }
    }
    return error.message;
  };

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
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);

        if (error.message.includes('Email not confirmed')) {
          setShowEmailConfirmAlert(true);
        }
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