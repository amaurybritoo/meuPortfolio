# Espaço Dellas

Página de links e catálogo administrável com a identidade visual marfim, caramelo, dourado e areia. A marca usa selo circular.

## Recursos

- `index.html`: página de links centralizada, com ticker da marca, card do catálogo, atendimento, redes e localização.
- `catalogo.html`: vitrine responsiva com capa Dellas, carrossel automático sem setas, busca, filtros de categoria, fotos, preços e consulta das peças pelo WhatsApp.
- `admin/`: painel com identidade Dellas para editar perfil, links, logo, fundo/capa, paleta, textos do catálogo e produtos.
- Imagens de produtos são reduzidas para WebP antes do envio. Produtos desativados não aparecem ao público.

## Ativar o catálogo no Supabase

Para uma instalação já existente, execute `supabase/catalog_migration.sql` no SQL Editor do Supabase. A migração cria a tabela de produtos, configura leitura pública apenas para itens publicados e grava oito peças fictícias para demonstrar o catálogo. Edite ou exclua essas peças no painel antes de divulgar produtos reais.

Em uma instalação nova, `supabase/link_page.sql` já inclui essa estrutura. O armazenamento de imagens usa o bucket público `link-assets` criado pelo script de configuração existente. O painel continua protegido por autenticação do Supabase.

Use apenas chave publicável no navegador. Nunca use uma chave `service_role`.

A imagem `assets/dellas-cover.png` é usada como fundo da página de links e como capa da vitrine. Os controles de pausa respeitam a preferência de movimento reduzido do dispositivo.

## Paleta Dellas

- Marfim `#F1ECE6`
- Caramelo `#B5825B`
- Dourado `#96652F`
- Areia `#D8C5B3`
- Branco suave `#FFFCF8`
