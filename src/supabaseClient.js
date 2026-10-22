import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://abzyyenjtlvpsrmmsxxu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFienl5ZW5qdGx2cHNybW1zeHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NjkzOTksImV4cCI6MjEwODA0NTM5OX0.ZSfZmRVf1VyjzWyIUi6uZT3_d_FLnZ1n7kPhTeoVyHk' 

export const supabase = createClient(supabaseUrl, supabaseKey)