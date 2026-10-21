-- ESPAÇO DELLAS · correção da base legada
-- Execute UMA VEZ no SQL Editor do projeto Supabase usado pelo site.
-- Este script preserva os outros perfis e substitui apenas o perfil principal
-- (profile_id nulo), apagando os cards antigos dessa página.

begin;

insert into public.link_page_settings (
  id,name,bio,logo_url,background_url,address,location_query,whatsapp,instagram,tiktok,vip,catalogo,updated_at
) values (
  1,
  'Espaço Dellas',
  'Peças para acompanhar seu estilo, do dia a dia aos dias de sol. Entregamos em Manaus.',
  null,
  null,
  'Avenida Tancredo Neves, 6, Parque 10 de Novembro, Manaus — AM, 69054-040, Brasil',
  'Espaço Dellas, Avenida Tancredo Neves, 6, Parque 10 de Novembro, Manaus, AM, 69054-040',
  'https://api.whatsapp.com/send/?phone=92993258071&text=Ol%C3%A1%2C+Espaço+Dellas%21+Vim+pelo+Instagram+e+gostaria+de+conhecer+as+pe%C3%A7as.&type=phone_number&app_absent=0',
  'https://www.instagram.com/espacodellasam/',
  '',
  'https://chat.whatsapp.com/FbHcH09HqTsF61CAkp1VCK?s=cl&p=i&mlu=4&ilr=4',
  '',
  now()
)
on conflict (id) do update set
  name=excluded.name,
  bio=excluded.bio,
  logo_url=excluded.logo_url,
  background_url=excluded.background_url,
  address=excluded.address,
  location_query=excluded.location_query,
  whatsapp=excluded.whatsapp,
  instagram=excluded.instagram,
  tiktok=excluded.tiktok,
  vip=excluded.vip,
  catalogo='',
  updated_at=now();

delete from public.link_page_links where profile_id is null;

insert into public.link_page_links (profile_id,type,title,subtitle,url,enabled,sort_order) values
  (null,'whatsapp','Converse com a gente','Tire dúvidas e peça atendimento','https://api.whatsapp.com/send/?phone=92993258071&text=Ol%C3%A1%2C+Espaço+Dellas%21+Vim+pelo+Instagram+e+gostaria+de+conhecer+as+pe%C3%A7as.&type=phone_number&app_absent=0',true,0),
  (null,'instagram','Inspirações no Instagram','Veja novidades e combinações','https://www.instagram.com/espacodellasam/',true,1),
  (null,'vip','Clube Dellas','Novidades e benefícios para você','https://chat.whatsapp.com/FbHcH09HqTsF61CAkp1VCK?s=cl&p=i&mlu=4&ilr=4',true,2);

commit;
