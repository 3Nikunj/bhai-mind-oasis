
// This edge function can be run to fix the RLS policies that are causing infinite recursion

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are not set');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fix RLS policies for profiles table - remove policies with recursive queries
    const { error: dropError } = await supabase.rpc('fix_profiles_rls_policies');
    
    if (dropError) {
      throw new Error(`Failed to fix RLS policies: ${dropError.message}`);
    }
    
    return new Response(JSON.stringify({ success: true, message: 'RLS policies fixed successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
