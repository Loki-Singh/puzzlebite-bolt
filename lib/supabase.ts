import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdanjczadkgcoukmsggn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYW5qY3phZGtnY291a21zZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTYxODYsImV4cCI6MjA3ODI3MjE4Nn0._9C3dOdUt3CLkJ-NWYuayfeJfNh3lh__7P1cR0D4p5A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
