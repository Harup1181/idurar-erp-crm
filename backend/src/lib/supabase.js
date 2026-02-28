import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for use in API routes (with RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  if (error.message) {
    return { error: error.message, status: 400 };
  }
  return { error: 'Database operation failed', status: 500 };
};

// Helper to get user from token
export const getUserFromToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return user;
};

// Helper to get admin user
export const getAdminUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  return getUserFromToken(token);
};
