-- Galeria de fotos por peça do catálogo Espaço Dellas.
-- Execute uma vez no SQL Editor do Supabase para habilitar múltiplas fotos.
alter table public.link_page_products
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

update public.link_page_products
set gallery_images = jsonb_build_array(image_url)
where image_url is not null
  and gallery_images = '[]'::jsonb;
