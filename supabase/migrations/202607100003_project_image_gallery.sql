-- Allows every project card to store an ordered gallery of images.
alter table public.projects
  add column if not exists image_paths text[] not null default '{}';

-- Preserve the previous single image as the first item in the gallery.
update public.projects
set image_paths = array[image_path]
where image_path is not null
  and coalesce(array_length(image_paths, 1), 0) = 0;
