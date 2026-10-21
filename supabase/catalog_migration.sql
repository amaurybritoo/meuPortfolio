-- Espaço Dellas · catálogo administrável e identidade de marca
-- Execute no Supabase SQL Editor. Seguro para executar novamente.

alter table public.link_page_settings add column if not exists catalog_title text not null default 'Peças para imaginar.';
alter table public.link_page_settings add column if not exists catalog_description text not null default 'Uma seleção feita para você. Consulte disponibilidade e tamanhos com a nossa equipe.';
alter table public.link_page_settings add column if not exists catalog_cta_text text not null default 'Fale com a equipe';
alter table public.link_page_settings add column if not exists catalog_whatsapp text not null default 'https://wa.me/5592993258071';
alter table public.link_page_settings add column if not exists brand_background text not null default '#F1ECE6';
alter table public.link_page_settings add column if not exists brand_primary text not null default '#B5825B';
alter table public.link_page_settings add column if not exists brand_accent text not null default '#96652F';
alter table public.link_page_settings add column if not exists brand_text text not null default '#34261F';

create table if not exists public.link_page_products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.link_page_profiles(id) on delete cascade,
  slug text unique not null,
  name text not null,
  category text not null default 'Novidades',
  description text not null default '',
  price numeric(10,2),
  image_url text,
  image_alt text,
  enabled boolean not null default true,
  is_demo boolean not null default false,
  show_in_carousel boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.link_page_products add column if not exists show_in_carousel boolean not null default true;
alter table public.link_page_products add column if not exists gallery_images jsonb not null default '[]'::jsonb;

alter table public.link_page_products enable row level security;
drop policy if exists "public read enabled catalog products" on public.link_page_products;
drop policy if exists "auth manage catalog products" on public.link_page_products;
create policy "public read enabled catalog products" on public.link_page_products
  for select to anon, authenticated using (enabled = true);
create policy "auth manage catalog products" on public.link_page_products
  for all to authenticated using (true) with check (true);
grant select on public.link_page_products to anon, authenticated;
grant insert, update, delete on public.link_page_products to authenticated;

-- Produtos fictícios para a proprietária conferir o layout. Podem ser editados ou removidos no painel.
insert into public.link_page_products(slug,name,category,description,price,enabled,is_demo,sort_order)
values
 ('vestido-aurora-demo','Vestido Aurora','Vestidos','Silhueta fluida · modelo de demonstração',189.90,true,true,1),
 ('vestido-serena-demo','Vestido Serena','Vestidos','Recorte delicado · modelo de demonstração',219.90,true,true,2),
 ('conjunto-duna-demo','Conjunto Duna','Conjuntos','Textura natural · modelo de demonstração',249.90,true,true,3),
 ('conjunto-iris-demo','Conjunto Íris','Conjuntos','Cor marcante · modelo de demonstração',279.90,true,true,4),
 ('vestido-alba-demo','Vestido Alba','Vestidos','Caimento leve · modelo de demonstração',199.90,true,true,5),
 ('blusa-nara-demo','Blusa Nara','Blusas','Toque macio · modelo de demonstração',89.90,true,true,6),
 ('calca-cora-demo','Calça Cora','Calças','Corte versátil · modelo de demonstração',149.90,true,true,7),
 ('conjunto-brisa-demo','Conjunto Brisa','Conjuntos','Combinação descontraída · modelo de demonstração',239.90,true,true,8)
on conflict (slug) do nothing;

create index if not exists link_page_products_public_order_idx on public.link_page_products(profile_id, enabled, sort_order, created_at);

-- O catálogo interno permanece como primeiro card da página de links.
update public.link_page_links
set url='catalogo.html', enabled=true, sort_order=0,
    title=coalesce(nullif(title,''),'Ver nosso catálogo'),
    subtitle=coalesce(nullif(subtitle,''),'Veja as peças disponíveis')
where profile_id is null and type='catalogo';

insert into public.link_page_links(profile_id,type,title,subtitle,url,sort_order,enabled)
select null,'catalogo','Ver nosso catálogo','Veja as peças disponíveis','catalogo.html',0,true
where not exists(select 1 from public.link_page_links where profile_id is null and type='catalogo');
