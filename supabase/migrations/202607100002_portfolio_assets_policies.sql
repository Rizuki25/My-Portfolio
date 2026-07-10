-- Run this after creating the `portfolio-assets` bucket in Supabase Storage.
-- The bucket may be public for delivery, but only listed admins may change its contents.
create policy "Admins can manage portfolio assets"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and (select public.is_admin())
)
with check (
  bucket_id = 'portfolio-assets'
  and (select public.is_admin())
);
