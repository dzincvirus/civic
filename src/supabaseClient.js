import { createClient } from "@supabase/supabase-js";

// Replace with your copied credentials from Supabase
const SUPABASE_URL = "https://wigvfoffhhprgldofpqa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ3Zmb2ZmaGhwcmdsZG9mcHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MjE2MzYsImV4cCI6MjEwNTQ5NzYzNn0.hzHLp6OsxdkGSR7x-_zoFBX3bd_EhFKY4EjweJT-Wfg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
