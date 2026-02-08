@echo off
set "SUPABASE_DB_PASSWORD=lovenest@9358"
cd ..\backend
npx supabase db push --db-url "postgresql://postgres.vnzbnsxaxhhlyxvnvcqf:lovenest@9358@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
