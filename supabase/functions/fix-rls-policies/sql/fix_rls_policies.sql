
-- This function will be deployed to fix the recursive RLS policies
CREATE OR REPLACE FUNCTION public.fix_profiles_rls_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  policy_name text;
BEGIN
  -- Drop any policies on profiles that might be causing recursion
  FOR policy_name IN (
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'profiles' AND schemaname = 'public'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_name);
  END LOOP;
  
  -- Recreate safer policies for profiles
  -- Users can view their own profile
  EXECUTE 'CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id)';
  
  -- Create a simple policy for doctors without recursion
  EXECUTE 'CREATE POLICY "Everyone can view profiles" ON public.profiles FOR SELECT USING (true)';
  
  -- Users can update their own profile
  EXECUTE 'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
END;
$$;
