# Amaury.dev — Portfólio pessoal

Portfólio pessoal desenvolvido para apresentar minha atuação em **desenvolvimento front-end, qualidade de software (QA) e automação de testes**. O site reúne apresentação profissional, habilidades, projetos, experiência, formação e canais de contato em uma interface responsiva com identidade visual dark e detalhes neon.

## Visão geral

- **Frontend:** React 19, TypeScript e Vite.
- **Navegação:** React Router, com páginas para a home, detalhes dos projetos, currículo, painel administrativo e página 404.
- **Estilização:** CSS organizado por componentes e áreas do site.
- **Ícones:** React Icons.
- **Conteúdo e mídia:** Supabase para conteúdo persistente e armazenamento de mídia; `src/data/portfolio.json` atua como conteúdo local de referência/fallback.
- **API e administração:** funções serverless na pasta `api/` e lógica de servidor em `server/`.
- **Publicação:** Vercel.

## Seções do site

1. **Início / Hero** — apresenta o nome, os cargos profissionais, a frase de destaque, a disponibilidade e os atalhos de contato. O fundo inclui elementos visuais animados.
2. **Sobre mim** — resume o perfil e a abordagem de trabalho, conectando desenvolvimento de interfaces com preocupação em qualidade e experiência de uso.
3. **Habilidades** — organiza tecnologias e práticas em grupos, como Front-end, QA e testes, e ferramentas.
4. **Projetos** — apresenta cards com categorias, resumos, tecnologias e links. Em telas pequenas, a lista pode ser percorrida horizontalmente e mostra um indicador de progresso. Há suporte a projetos relacionados agrupados em conjuntos.
5. **Experiência profissional** — apresenta a trajetória profissional em formato de linha do tempo.
6. **Formação** — reúne formação acadêmica e cursos/estudos relevantes.
7. **Contato** — oferece caminhos para entrar em contato, incluindo links de redes e formulário.
8. **Rodapé** — repete a identidade do portfólio e os atalhos de navegação.

Também existem páginas complementares: **detalhes de projeto** (`/projeto/:slug`), **currículo** (`/curriculo`), **administração** (`/admin`) e **página não encontrada**.

## Projetos cadastrados

Os projetos são definidos em `src/data/portfolio.json` e o conteúdo ativo pode ser gerenciado pelo painel. Os itens abaixo refletem o conjunto local incluído neste repositório:

- **Testes E2E — EBAC Shop** — projeto de QA com Cypress e JavaScript, automatizando fluxos end-to-end que simulam ações reais de navegação e compra. O cadastro inclui link para o repositório GitHub.
- **Demasi Boutique** — site de apresentação da marca, com experiência web própria. Está configurado como um conjunto de projetos relacionados.
- **Demasi Boutique Links** — página de links para centralizar os canais digitais da marca; aparece relacionado ao projeto principal.
- **Casa Oito Del Mare** — site para apresentar o espaço e reunir suas informações em uma interface web.
- **Dashboard** — exemplo de painel de análise de dados com React, D3.js, Node.js e MongoDB. Está salvo como rascunho e não aparece na vitrine pública por padrão.
- **Landing Page** — exemplo de página de captação de leads com HTML, CSS, JavaScript e Google Analytics. Também está salvo como rascunho.

Os projetos podem ser editados, reordenados, agrupados, ocultados ou publicados pelo painel administrativo, de acordo com a configuração do ambiente.

## Como foi desenvolvido — passo a passo

### 1. Estrutura inicial

O projeto foi organizado como uma aplicação React com TypeScript e Vite. O Vite cuida do servidor de desenvolvimento e do empacotamento; o TypeScript ajuda a identificar inconsistências de tipos antes da publicação.

### 2. Identidade visual e layout

A interface recebeu uma identidade escura com acentos neon, tipografia voltada a tecnologia, componentes reutilizáveis e folhas de estilo separadas por área. O layout foi pensado para desktop e dispositivos móveis, com foco visível, navegação por teclado e respeito à preferência do sistema por movimento reduzido.

### 3. Conteúdo centralizado

Os dados do perfil, habilidades, formação, experiência, seções e projetos ficam estruturados em JSON e são descritos pelos tipos de `src/tipos.ts`. `src/data/padrao.ts` normaliza os dados e fornece valores padrão quando campos opcionais não estão preenchidos. O contexto em `src/contexto/` compartilha o conteúdo com os componentes e permite trabalhar com prévias do painel.

### 4. Componentes e seções

A home foi dividida em componentes menores para facilitar manutenção: `Hero`, `Sobre`, `Habilidades`, `Projetos`, `Experiencia`, `Contato` e componentes comuns. O menu, o rodapé, o fundo e o botão de voltar ao topo ficam em `src/componentes/layout/`.

### 5. Vitrine e páginas de projetos

Cada projeto possui um `slug` usado na rota `/projeto/:slug`. Os cards e a página detalhada usam a mesma fonte de dados, evitando divergências entre a prévia do card e a página interna. As páginas podem apresentar descrição, tecnologias, imagens, testes, desafios, soluções e links, conforme os dados cadastrados. Galerias e lightbox são implementados em `src/componentes/projeto/`.

### 6. Carrossel de projetos e retorno ao topo

A lista de projetos permite rolagem horizontal em telas menores e atualiza um indicador de posição. Quando o usuário clica no botão **Voltar ao topo**, a página retorna ao início e a lista de projetos também é reposicionada no primeiro card. A rolagem respeita a configuração de redução de movimento do dispositivo.

### 7. Painel administrativo

A rota `/admin` contém abas para gerenciar o perfil, apresentação, habilidades, projetos, experiência, formação, contato, seções, aparência e SEO. O painel permite preparar alterações, pré-visualizar rascunhos, validar campos e publicar o conteúdo persistido. A autenticação e as operações sensíveis são tratadas pelo lado do servidor; segredos devem permanecer nas variáveis de ambiente, nunca no código do navegador.

### 8. API e armazenamento

As funções em `api/` e os módulos de `server/` conectam a aplicação aos serviços necessários para autenticação administrativa, conteúdo e mídia. O Supabase é utilizado para persistência e armazenamento. O frontend usa apenas configurações públicas apropriadas; chaves administrativas e segredos devem existir exclusivamente no ambiente privado da Vercel.

### 9. Acessibilidade, SEO e responsividade

O HTML define idioma `pt-BR`, metadados para mecanismos de busca e compartilhamento, favicons e imagem Open Graph. O projeto inclui cuidados com foco de teclado, textos acessíveis para controles, imagens com texto alternativo, rotas internas e preferência por movimento reduzido. As páginas devem ser verificadas em larguras móveis e desktop antes de publicar.

### 10. Validação e publicação

Antes de publicar, instale as dependências, execute o lint e gere o build de produção. A aplicação pode ser publicada pela integração Git da Vercel. Para rotas e funções de servidor, configure as variáveis de ambiente necessárias no painel da Vercel e teste também o ambiente com `vercel dev`.

## Estrutura do projeto

```text
api/                         Funções serverless
public/                      Imagens, ícones, fontes e mídia pública
server/                      Integrações e validações do lado do servidor
src/
  componentes/
    comuns/                  Componentes reutilizáveis
    dragao/                  Desenho e animação do dragão
    home/                    Seções e cards da página inicial
    layout/                  Navbar, rodapé, fundo e botão de topo
    projeto/                 Galeria e visualizador de mídia
  contexto/                  Contexto e carregamento dos dados
  data/                      JSON local e valores padrão
  estilos/                   CSS por seção/componente
  paginas/                   Home, projeto, currículo, admin e 404
  utilitarios/               Helpers de texto, imagens, ícones e listas
  tipos.ts                   Modelos TypeScript
index.html                   HTML inicial e metadados
vercel.json                  Configuração de rotas na Vercel
vite.config.ts               Configuração do Vite
```

## Executar localmente

Requisitos: Node.js compatível com a versão atual do Vite e npm.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Verificar os tipos e gerar o build de produção
npm run build

# 4. Executar o lint
npm run lint

# 5. Visualizar localmente a versão compilada
npm run preview
```

O Vite normalmente disponibiliza o projeto em `http://localhost:5173`. O frontend sozinho não substitui as funções serverless de autenticação e administração. Para testar o fluxo completo do painel localmente, configure as variáveis de ambiente necessárias e use `vercel dev`.

## Configuração segura da Vercel e do Supabase

Configure no painel da Vercel as variáveis usadas pelas funções do servidor, conforme os nomes referenciados em `api/` e `server/`. Entre elas podem estar a URL do Supabase, o código de acesso administrativo e os segredos de sessão/assinatura. Use valores fortes e privados, diferentes entre desenvolvimento e produção.

- Não envie arquivos `.env` com segredos para o GitHub.
- Não inclua chaves `service_role` no frontend.
- Faça um novo deploy depois de alterar variáveis de ambiente.
- Teste a autenticação, a leitura pública do portfólio, a prévia de rascunhos e o envio de mídia antes de considerar a publicação concluída.

## Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | inicia o servidor Vite de desenvolvimento |
| `npm run build` | verifica os tipos e gera a versão de produção |
| `npm run lint` | executa as verificações do ESLint |
| `npm run preview` | serve localmente o build gerado |

## Melhorias e manutenção

- Manter os dados do perfil e os projetos atualizados no painel.
- Adicionar evidências reais aos casos de QA: cenários, resultados, bugs encontrados e cobertura dos fluxos automatizados.
- Otimizar imagens novas antes de publicá-las e usar texto alternativo descritivo.
- Conferir a navegação por teclado, o layout móvel e as rotas após cada alteração.
- Executar `npm run lint` e `npm run build` antes de cada publicação.

---

**Amaury.dev** · Portfólio pessoal de desenvolvimento front-end e qualidade de software.
