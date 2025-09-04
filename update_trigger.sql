-- Run this in your Supabase SQL editor to update the trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone, name)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;
