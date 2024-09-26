import { useSupabaseClient } from '#imports';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const { toastError, toastSuccess } = useAppToast();

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
      toastSuccess({
        title: 'Success',
        description: 'Sign up successful!',
      });
      return true;
    } catch (error: any) {
      toastError({
        title: 'Error signing up',
        description: error.message,
      });
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toastSuccess({
        title: 'Success',
        description: 'Login successful!',
      });
      return true;
    } catch (error: any) {
      toastError({
        title: 'Error authenticating',
        description: error.message,
      });
      return false;
    }
  };

  const googleSignIn = async (redirectTo: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toastError({
        title: 'Error authenticating',
        description: error.message,
      });
    }
  };

  return {
    signUp,
    signIn,
    googleSignIn,
  };
};
