-- Permite escolher quais peças aparecem no carrossel do topo.
-- Execute uma única vez no SQL Editor do Supabase.
alter table public.link_page_products
  add column if not exists show_in_carousel boolean not null default true;
