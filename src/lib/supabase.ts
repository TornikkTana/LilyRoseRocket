import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// We use the service role key because the API routes need to bypass RLS 
// for admin operations (like uploading files, creating bouquets).
// CAUTION: Never expose the service role key to the client!
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
