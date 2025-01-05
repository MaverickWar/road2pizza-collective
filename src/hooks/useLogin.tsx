import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LoginFormValues } from '@/types/auth';
import type { User } from '@supabase/supabase-js';

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

      // First check if the user exists
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
      
      if (getUserError) {
        console.error('Error checking user:', getUserError);
        toast.error('An error occurred while verifying your account');
        return;
      }

      const userExists = users?.some((user: User) => user.email === email);
      
      if (!userExists) {
        console.log('User not found:', email);
        toast.error('No account found with this email address');
        return;
      }

      // Attempt login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', {
          message: signInError.message,
          status: signInError.status,
          name: signInError.name,
          details: signInError
        });

        if (signInError.message.includes('Email not confirmed')) {
          setShowEmailConfirmAlert(true);
          return;
        }

        if (signInError.message.includes('Invalid login credentials')) {
          toast.error('Incorrect password. Please try again.');
          return;
        }

        if (signInError.message.includes('Body is disturbed')) {
          console.error('Body disturbed error:', signInError);
          toast.error('Connection error. Please try again.');
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