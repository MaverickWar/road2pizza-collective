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
      message: error.message,
      status: error.status,
      name: error.name,
      timestamp: new Date().toISOString()
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
          if (error.message.includes('rate limit')) {
            return 'Too many login attempts. Please try again later.';
          }
          return 'Invalid login attempt. Please check your credentials and try again.';
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
      console.log('[useLogin] Starting password reset for:', { 
        email,
        timestamp: new Date().toISOString()
      });
      
      setIsSendingReset(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('[useLogin] Password reset error:', {
          error,
          errorMessage: error.message,
          email,
          timestamp: new Date().toISOString()
        });
        toast.error('Failed to send reset email. Please try again.');
        return;
      }

      console.log('[useLogin] Password reset email sent successfully:', {
        email,
        timestamp: new Date().toISOString()
      });
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('[useLogin] Unexpected error during password reset:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        email,
        timestamp: new Date().toISOString()
      });
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      console.log('[useLogin] Starting login attempt:', { 
        email: values.email,
        timestamp: new Date().toISOString()
      });
      
      setIsLoading(true);
      setShowEmailConfirmAlert(false);
      
      const email = values.email.toLowerCase().trim();
      const { password } = values;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useLogin] Login error:', {
          error,
          errorMessage: error.message,
          errorStatus: error.status,
          email,
          timestamp: new Date().toISOString()
        });
        
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);

        if (error.message.includes('Email not confirmed')) {
          setShowEmailConfirmAlert(true);
        }
        return;
      }

      if (data?.user) {
        console.log('[useLogin] Login successful:', {
          id: data.user.id,
          email: data.user.email,
          lastSignIn: data.user.last_sign_in_at,
          timestamp: new Date().toISOString()
        });
        
        toast.success('Login successful');
        navigate('/');
      } else {
        console.error('[useLogin] No user data received from successful login:', {
          data,
          timestamp: new Date().toISOString()
        });
        toast.error('Login failed - please try again');
      }
    } catch (error) {
      console.error('[useLogin] Unexpected error during login:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
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