insert into public.site_admins (user_id)
values ('4dd9b725-ef07-449b-8610-a1ce0d47c715')
on conflict (user_id) do nothing;

