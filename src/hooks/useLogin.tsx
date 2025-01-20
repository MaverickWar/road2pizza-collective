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
      name: error.name
    });

    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Email not confirmed')) {
            return 'Please check your email to confirm your account before logging in.';
          }
          if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email/username or password. Please check your credentials and try again.';
          }
          if (error.message.includes('invalid_credentials')) {
            return 'Invalid email/username or password. Please check your credentials and try again.';
          }
          if (error.message.includes('rate limit')) {
            return 'Too many login attempts. Please try again later.';
          }
          return 'Invalid login attempt. Please check your credentials and try again.';
        case 401:
          return 'Invalid credentials. Please check your email/username and password.';
        case 422:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many login attempts. Please try again later.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleForgotPassword = async (identifier: string) => {
    try {
      console.log('Starting password reset for:', identifier);
      setIsSendingReset(true);

      // Check if identifier is an email
      const isEmail = identifier.includes('@');
      let email: string;

      if (isEmail) {
        email = identifier;
      } else {
        // Get email from profiles table using case-insensitive comparison
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', identifier)
          .maybeSingle();

        if (profileError) {
          console.error('Profile lookup error:', profileError);
          toast.error('Could not find a user with this username.');
          return;
        }

        if (!profile?.email) {
          console.log('No email found for username:', identifier);
          toast.error('Could not find a user with this username.');
          return;
        }
        email = profile.email;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error(getErrorMessage(error));
        return;
      }

      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      console.log('Starting login attempt...');
      setIsLoading(true);
      setShowEmailConfirmAlert(false);
      
      const identifier = values.identifier.toLowerCase().trim();
      const { password } = values;
      
      console.log('Processing login for identifier:', identifier);

      // Check if identifier is an email
      const isEmail = identifier.includes('@');
      let email: string;

      if (isEmail) {
        email = identifier;
        console.log('Using email for login');
      } else {
        console.log('Looking up email for username');
        // Get email from profiles table using case-insensitive comparison
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', identifier)
          .maybeSingle();

        if (profileError) {
          console.error('Profile lookup error:', profileError);
          toast.error('Could not find a user with this username.');
          return;
        }

        if (!profile?.email) {
          console.log('No email found for username:', identifier);
          toast.error('Could not find a user with this username.');
          return;
        }
        email = profile.email;
        console.log('Found email for username');
      }

      console.log('Attempting sign in with email');
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
        navigate('/');
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