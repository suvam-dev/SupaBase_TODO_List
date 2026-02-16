import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhiffesjhlvaznnrbygr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoaWZmZXNqaGx2YXpubnJieWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODc1NDAsImV4cCI6MjA4Njc2MzU0MH0.j_75foMQUuLcvLwXMkyjYeJuYZZ3UNCeybb2t_4xBGs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
