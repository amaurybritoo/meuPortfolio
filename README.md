# Portfólio · Amaury Brito

Portfólio pessoal feito com **React + TypeScript + Vite**, com painel de administração em `/admin`
(tudo configurável sem mexer no código) e um dragão voando ao fundo da página.

> **Objetivo do site:** apresentar o Amaury como **Front-end Developer e QA Engineer**, mostrar projetos reais
> (com testes, desafios e soluções) e facilitar o contato de recrutadores e clientes.

---

## Como rodar

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # confere os tipos e gera a pasta dist/
npm run preview    # testa o build localmente
npm run lint
```

As dependências são as mesmas do projeto original (`react`, `react-dom`, `react-router-dom`, `react-icons`).
O `framer-motion` continua instalado, mas não é mais usado: pode ser removido com `npm uninstall framer-motion`
quando quiser.

---

## O que mudou e onde ficam as coisas

```
src/
  data/portfolio.json     ← TODO o conteúdo do site (é o arquivo que o admin atualiza)
  data/padrao.ts          ← valida e completa os dados (o site nunca quebra por campo faltando)
  tipos.ts                ← descreve cada campo editável
  contexto/               ← entrega os dados aos componentes (e troca para o rascunho na prévia)
  componentes/
    layout/               ← menu, rodapé, fundo, botão de topo
    home/                 ← Hero, Sobre, Habilidades, Projetos (cards), Formação, Contato
    projeto/              ← galeria e visualizador de imagens (zoom, teclado, toque)
    dragao/               ← desenho e voo do dragão
  paginas/                ← Home, Projeto, 404 e Admin
  paginas/admin/          ← abas do painel (Perfil, Projetos, Aparência, Publicar...)
  estilos/                ← CSS por área (variáveis de cor em global.css)
  utilitarios/            ← GitHub, imagens, ícones, rascunho local
public/
  Projetos/               ← imagens dos projetos (WebP, já otimizadas)
  uploads/                ← imagens enviadas pelo admin (criadas automaticamente ao publicar)
```

### Principais correções

* **Cards dos projetos:** os dados estavam duplicados (um arquivo para o card, outro para a página), por isso o card
  da EBAC levava a "Projeto não encontrado". Agora existe **uma única fonte** (`portfolio.json`).
  O card inteiro é clicável (imagem, título e resumo), os ícones de site/GitHub funcionam à parte,
  e no celular os cards viram uma coluna (sem rolagem lateral).
* **Responsivo de verdade:** testado de 320 px a 1440 px, em todas as páginas e abas do admin, sem rolagem lateral.
* **Imagens:** de ~4,3 MB para ~0,9 MB em `public/` (WebP, ícone de 2,4 MB trocado por favicons de verdade).
* **SEO e acessibilidade:** `lang="pt-BR"`, descrição, imagem de compartilhamento, título por página, "pular para o
  conteúdo", foco visível, teclado em todo o site, `prefers-reduced-motion` respeitado.
* **Havia dois `id="contato"`** (seção e rodapé), o que quebrava a âncora: corrigido.
* **Nomes de arquivo com acento** (`print_serviços.png`) foram trocados por nomes sem acento.

---

## Painel de administração

Abra **`/admin`** (ex.: `https://seusite.com.br/admin`). O painel pede um código de acesso validado no servidor,
e não há link para ele no site. A sessão fica em cookie `HttpOnly` por até 8 horas; o código não é salvo no código
do site nem no navegador.

Antes de usar no Vercel, cadastre `ADMIN_ACCESS_CODE` e `ADMIN_SESSION_SECRET` em **Project → Settings → Environment Variables** e faça um
novo deploy. `ADMIN_ACCESS_CODE` é o código de entrada; `ADMIN_SESSION_SECRET` deve ser uma chave aleatória forte
(por exemplo, gerada com `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`). Guarde ambos somente nas variáveis privadas do projeto; não os coloque em arquivos `.env` enviados
ao GitHub, `portfolio.json` ou no código do frontend. Para desenvolvimento local, use `vercel dev` com essas variáveis
definidas no ambiente do terminal, pois o Vite sozinho não executa a função de autenticação.

| Aba | O que edita |
|---|---|
| **Perfil** | nome, cargos que alternam, frase do topo, foto, logo, disponibilidade, currículo (PDF), e-mail, WhatsApp, redes |
| **Sobre** | parágrafos de apresentação e números de destaque |
| **Habilidades** | grupos e itens, cada um com ícone |
| **Projetos** | cards e páginas: capa, banner, resumo, descrição, tecnologias, links, galeria de prints, testes, desafios e soluções, rascunho/publicado, ordem |
| **Formação** | linha do tempo de cursos e experiências |
| **Contato** | textos, mensagem padrão do WhatsApp, formulário |
| **Seções** | liga/desliga cada seção e define os títulos |
| **Aparência** | cores e **todas as opções do dragão** |
| **Google** | título e descrição para buscas e compartilhamento (com prévia) |
| **Publicar** | verificação, publicação, backup e restauração |

### Como o admin funciona

1. **Tudo que você edita vira rascunho**, salvo automaticamente no seu navegador (nada é publicado ainda).
2. **Pré-visualizar** abre o site real mostrando o rascunho (inclusive projetos em rascunho). Uma faixa amarela avisa
   que é prévia e há o botão "Sair da prévia".
3. **Publicar** grava o conteúdo no seu repositório do GitHub; a Vercel percebe o commit e atualiza o site sozinha
   em 1 a 2 minutos. A função serverless do Vercel só valida o acesso administrativo.
4. Antes de publicar o admin confere erros comuns (projeto sem nome, endereço repetido, link sem `https://`, e-mail
   inválido) e explica em português o que corrigir.

Imagens enviadas pelo admin são redimensionadas e convertidas para WebP no próprio navegador; ao publicar, viram
arquivos em `public/uploads/` e o JSON guarda só o caminho (`/uploads/xxxx.webp`).

### Publicar pelo GitHub (uma configuração só)

1. No GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** *Only select repositories* → escolha o repositório do portfólio.
3. **Permissions → Repository permissions → Contents: Read and write.**
4. Copie o token, abra **/admin → Publicar**, confira usuário/repositório/branch e cole o token.
   Clique em **Testar conexão** e depois **Publicar agora**.

> **Segurança:** o token só vale para esse repositório e, por padrão, só fica na memória da aba (some ao fechar).
> Marque "Lembrar o token neste navegador" apenas no seu computador. Como qualquer publicação exige o token,
> quem abrir `/admin` sem ele consegue mexer só no próprio rascunho, nunca no seu site.

### Sem GitHub? Publicação manual

Em **Publicar → Baixar portfolio.json**, substitua `src/data/portfolio.json` no projeto e faça o commit.
Para trazer um arquivo de volta ao admin use **Importar portfolio.json**.

---

## O dragão

Um dragão desenhado em canvas (corpo ondulante, asas que batem, cabeça com chifres) atravessa a tela de tempos em
tempos, indo e voltando.

* Fica **atrás** do conteúdo, **não recebe cliques** e tem **pouca opacidade** (20% por padrão) para nunca atrapalhar
  a leitura.
* É leve: o desenho roda a ~30 quadros/s num canvas pequeno e a movimentação usa só `transform`.
  Para quando a aba fica escondida.
* Quem ativa "reduzir animações" no aparelho **não vê** o dragão.
* No admin (**Aparência → Dragão**) você liga/desliga e ajusta **intensidade, velocidade, tamanho, cor e pausa entre
  voos**, com prévia ao vivo.
* Código: `src/componentes/dragao/desenhar.ts` (desenho) e `Dragao.tsx` (voo).

---

## Ajustes comuns (no código)

* **Mais ícones de tecnologia:** importe o ícone do `react-icons` em `src/utilitarios/icones.ts` e acrescente na lista;
  ele passa a aparecer nos seletores do admin.
* **Domínio próprio e compartilhamento:** troque `/og-image.jpg` em `index.html` por uma URL absoluta
  (`https://seudominio/og-image.jpg`) para o WhatsApp/LinkedIn mostrarem a imagem.
* **Vercel:** o `vercel.json` já redireciona qualquer rota para o `index.html` (necessário para `/projeto/...` e `/admin`).

---

## Ideias para a próxima etapa

* Trocar os textos de exemplo por seus resultados reais (números de testes, bugs encontrados, tempo de execução do
  Cypress) em **Projetos → Testes realizados**: é isso que mais chama atenção de quem contrata QA.
* Subir o PDF do currículo em **Perfil → Currículo** e preencher **Localização** e **Números de destaque**.
* Completar os projetos *Dashboard* e *Landing Page* (hoje são rascunhos) e publicá-los pelo admin.
