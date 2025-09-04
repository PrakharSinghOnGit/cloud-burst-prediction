
create table public.users (
  id uuid not null primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email varchar(255),
  phone varchar(255),
  name varchar(255)
);

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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
