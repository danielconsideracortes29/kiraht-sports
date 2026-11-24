# Revisão da prévia

Atualizado em 24/11/2026 (botão do Transfermarkt nas fichas, Chamusca, datas do Instagram ocultas). As pendências de cada atleta estão em `PENDENCIAS.md`.

## Para sua revisão
| Tema | Situação |
|---|---|
| **Yago: clube** | ✅ Resolvido. Clube atual **Al Fayha** (Arábia Saudita · Saudi Pro League), conforme confirmação da agência. “Alfeiro” foi entendido como Al Fayha porque o Transfermarkt confirma o empréstimo de Yago Souza (agência Kiraht Sports) do América Mineiro ao Al-Fayha desde 06/09/2026. Não consegui conferir pelo Instagram (@yagosouza006), porque o Instagram exige login. O card, a ficha (com “Emprestado por: América Mineiro”), o país e os totais da Home foram atualizados em PT e EN. |
| **Umberto Louzer** | ✅ Pendência resolvida pela agência em 24/11/2026. O site mostra Criciúma. |
| **Chamusca** | ✅ Início no Al Wahda em **01/07/2026**, conforme o Transfermarkt e confirmado pela agência. A ficha mostra “No clube desde 1 de julho de 2026” (EN: “At the club since 1 July 2026”; AR: “في النادي منذ 1 يوليو 2026”), e a trajetória marca o mesmo início. |
| **Édson: foto em ação** | ✅ Confirmada pela agência em 24/11/2026: a foto enviada é idêntica à IMG_3797 da planilha. Ela aparece inteira no topo da ficha (recortada no círculo do original, 780×780 px), em PT, EN e AR. |
| **Carlos André: resolução** | ✅ Aprovado manter a IMG_3782 (192×192 px) no card até a agência enviar um retrato mais nítido. |
| **Zé Vitor** | ✅ Nome “Zé Vitor” e cargo “Soccer Agent” (substituiu “Soccer Agency”), nos dois idiomas. |
| **Samir Caetano** | ✅ A ficha existente (`/atletas/samir/`) agora se chama Samir Caetano, com o retrato no card, a foto em ação inteira, o Instagram @samircaetano e os dados do Transfermarkt. Não foi criada ficha duplicada. |
| **Filtros de país e clube** | A prévia não tem filtros. O país e o clube aparecem em cada card, e os totais da Home (clubes e países) são recalculados automaticamente. |

## Publicação (Netlify via GitHub) — preparado em 24/11/2026
- **Site estático**: `output: "static"` no `astro.config.mjs`, sem adaptador nem funções de servidor. O build gera só HTML, CSS, JS e mídia.
- **Pasta de saída**: `dist/` (`netlify.toml` → `publish = "dist"`, `command = "npm run build"`, `NODE_VERSION = "22"`).
- **Autossuficiente**: o build não lê mais nada fora de `preview-astro/`. O `data.js` do site antigo foi copiado (sem alterações) para `src/data/data.js`, e o original continua na pasta de cima.
- **Conteúdo do build**: 69 páginas (23 PT, 23 EN, 23 AR), as 48 fotos do elenco, as 4 fotos e o vídeo do Instagram (12,3 MB, mais o pôster), 66 botões do Transfermarkt (22 perfis únicos) e nenhum link interno quebrado. Total: cerca de 20 MB.
- **Git**: o `.gitignore` exclui `.env`, `.env.*` (menos o `.env.example`, que é vazio), `node_modules/`, `dist/`, `.astro/`, `.netlify/`, `.tools/` (Node local) e `.DS_Store`. Nenhuma credencial foi encontrada nos arquivos versionados: são 150 arquivos, cerca de 38 MB.
- **Teste de clone limpo**: com só os arquivos versionados e sem a pasta de cima, `npm ci` + `npm run build` geraram o mesmo `dist/`.
- **Raiz do repositório (recomendado)**: o conteúdo de `preview-astro/` como raiz. Na Netlify não é preciso preencher "Base directory".
  - Se o repositório tiver a pasta inteira do projeto, use **Base directory = `preview-astro`** (o `netlify.toml` dela é lido).
- ⚠️ **Antes de abrir ao público**: todas as páginas têm `<meta name="robots" content="noindex">`, e o rodapé diz “Prévia local para aprovação visual — não publicada”. Devem ser retirados quando o site for oficial.

## Botão “Ver perfil no Transfermarkt” (24/11/2026)
- Está na seção de informações da ficha de cada um dos **20 jogadores e 2 treinadores**, logo abaixo dos dados, e abre o perfil completo numa nova aba (`target="_blank"`, `rel="noopener"`).
  - PT: “Ver perfil no Transfermarkt”
  - EN: “View Transfermarkt profile”
  - AR: “عرض الملف الشخصي على ترانسفير ماركت”
- Os links são os já verificados em `src/data/transfermarkt.json`. Todos foram reconferidos em 24/11/2026: cada página respondeu, e nome, data de nascimento, clube atual e agência (Kiraht Sports) batem. **Nenhum jogador ficou pendente.**
- Carlos André, Evans e Samuel ainda não têm valor de mercado publicado no Transfermarkt, mas o perfil é o correto.
- **Treinadores incluídos** (pedido de 24/11/2026): Umberto Louzer e Péricles Chamusca também têm o botão, que leva aos perfis de treinador. Reconferidos no mesmo dia: nome, data de nascimento, clube atual (Criciúma e Al-Wahda) e agente Kiraht Sports batem. Total: 22 fichas × 3 idiomas = 66 botões verificados.
- Ajuste junto: na trajetória em árabe, os períodos (ex.: 2011–2012) aparecem numa linha só e na ordem certa no celular.

## Escritório no rodapé (24/11/2026)
- Nos três idiomas, o rodapé mostra **somente o escritório de Dubai**, informado pela agência:
  - PT: Marasi Drive, Business Bay, Dubai, Emirados Árabes Unidos
  - EN: Marasi Drive, Business Bay, Dubai, United Arab Emirates
  - AR: شارع مراسي، الخليج التجاري، دبي، الإمارات العربية المتحدة
  - Link “Ver no mapa” para o Google Maps (busca por Marasi Drive, Business Bay).
- ⏳ **Edifício e sala em aberto** até a sua confirmação; o rodapé mantém só Marasi Drive, Business Bay, Dubai. Basta preencher `edificio` e `sala` em `src/data/contato.json`.
- Os endereços cadastrais brasileiros (Niterói e São Gonçalo) e a lista de países foram **retirados** do site.
- **Mercados de atuação** (texto separado, nos três idiomas), conforme os clubes dos clientes no [Transfermarkt](https://www.transfermarkt.com.br/kiraht-sports/beraterfirma/berater/5117), consultado em 24/11/2026: Brasil; Golfo (Emirados Árabes Unidos, Arábia Saudita, Catar, Kuwait e Bahrein); Irã; Ásia (Tailândia e China); Europa (Turquia, Ucrânia e Rússia).
- Fontes da pesquisa anterior: o [perfil oficial @kirahtsports](https://www.instagram.com/kirahtsports/) diz “Offices in 🇧🇷 🇸🇦 🇦🇪”, e os cadastros do CNPJ estão em [Econodata](https://www.econodata.com.br/consulta-empresa/21065904000175-flavio-viana-eventos-esportivos-ltda) e [CNPJ Consultas](https://www.cnpjconsultas.com/empresa/flavio-viana-eventos-esportivos-ltda/21065904000175).

## Idiomas: português, inglês e árabe
- **Endereços**: português é o padrão (`/`, `/atletas/…`); inglês fica em `/en/`, `/en/athletes/…`; árabe em `/ar/`, `/ar/athletes/…`.
- **Seletor `PT | EN | العربية`**: aparece no cabeçalho do computador e dentro do **menu do celular** (novo botão ☰). Ao trocar de idioma, o visitante vai para a página equivalente (inclusive a seção, ex.: `#instagram`), e a escolha fica salva no navegador.
- **Árabe**: `lang="ar"` e `dir="rtl"`. O layout espelha: logo à direita, textos alinhados à direita, trajetória com a linha à direita e botão “voltar” apontando para a direita.
  - Carrossel: a seta “anterior” fica à direita, os ícones são espelhados, e o teclado e o deslize seguem o sentido de leitura.
  - Animações horizontais também são espelhadas.
  - Fonte do sistema com suporte ao árabe, sem espaçamento entre letras (que quebraria as ligaduras).
- **Traduzidos**: navegação, botões, textos institucionais, seção Instagram (títulos, controles e rótulos de acessibilidade), fichas (posições, nacionalidades, datas, pé preferido, empréstimos, funções, licenças) e rodapé. As bios dos treinadores em árabe estão em `src/data/bios-ar.json`.
- **Preservados**: nomes de atletas, clubes, competições e links. Os @ do Instagram ficam isolados da direita para a esquerda (`<bdi dir="ltr">`), então leem corretamente dentro do texto em árabe. O site não exibe e-mails nem telefones; se forem incluídos, devem receber o mesmo tratamento.
- **Mantido em inglês, como pedido**: o cargo “Soccer Agent” (Zé Vitor).
- ✅ Versão em árabe e conferência visual **aprovadas para a prévia** pela agência em 24/11/2026.

## Elenco
- O site mostra somente quem está na planilha final: **20 jogadores e 2 treinadores**. Os 14 ausentes saíram das páginas, da navegação e dos destaques.
- Hugo Moura saiu do destaque, e o bloco de destaque foi removido. O botão principal "Conheça o elenco" ("Meet the roster") leva ao elenco completo.
- Os nomes seguem a planilha (ex.: Lazaro, Kaka Mendes, Chamusca, Flavio Viana). As fichas mostram o **nome esportivo** do Transfermarkt quando ele é diferente (ex.: Samir Caetano, Edson Mardden).
- Samir usa as fotos indicadas na planilha (IMG_0428 e IMG_0429).

## Pesquisa no Transfermarkt (20/11/2026)
- 22 de 22 perfis encontrados e completados. Em todos o Transfermarkt indica a agência **Kiraht Sports**, o que confirma a identidade e evita homônimos.
- Campos: nome esportivo, nome completo, posição principal e secundárias, nascimento (data e cidade), nacionalidade, altura, pé preferido, clube atual, empréstimo e trajetória profissional. Treinadores: função, licença e trajetória como técnico.
- **Trajetória:** só a carreira profissional (sem categorias de base), da mais antiga à atual, com períodos por ano e empréstimos marcados. Retornos de empréstimo com menos de 4 meses antes de uma nova saída foram agrupados.
- Cada ficha traz o link do perfil e a data da consulta. Os textos do site são próprios, e as fotos são as fornecidas pela agência.
- Arquivo de dados: `src/data/transfermarkt.json`.

## Fotos nas fichas
- A foto em ação aparece **inteira**, sem cortes nem distorção (`object-fit: contain`), sobre um fundo azul-marinho do site. As informações ficam abaixo.
- Teste automático em 1440 px e 375 px nas 44 fichas (PT e EN): todas as imagens mantêm a proporção original, e nenhuma página tem rolagem lateral.

## Highlights
Omitidos em todas as fichas.

## Idiomas
Português é o padrão (`/`, `/atletas/…`) e o inglês fica em `/en/`, `/en/athletes/…`. Posições, nacionalidades, datas, pé preferido e notas da trajetória são traduzidos; nomes próprios e clubes são preservados.

## Instagram da Kiraht (Home)
- **Vídeo “Encerramento da janela”** (“Transfer window wrap-up” em EN): botão de reprodução sobre o vídeo, controles nativos e botão “Tela cheia” (no iPhone abre o player em tela cheia). O vídeo pausa sozinho quando o visitante rola para longe.
- **Publicações recentes**: carrossel com as 4 fotos fornecidas, na ordem dos arquivos (Foto 1 → Foto 4). A foto troca a cada **5 segundos** com transição suave (medido: 5.000 ms entre as trocas). Tem setas, indicadores, botão de pausa, setas do teclado e deslize no celular, e as imagens aparecem inteiras (`object-fit: contain`). A rotação pausa fora da tela, com a aba oculta e, com movimento reduzido, já começa pausada.
- **Datas**: **ocultas** no site até serem verificadas (pedido de 24/11/2026). Os arquivos só têm a data em que foram salvos (20/11/2026, 11h32–11h33), registrada em `src/data/instagram.json`.
- **Botão “Ver Instagram da Kiraht”** → https://www.instagram.com/kirahtsports/
- **Para atualizar**: coloque os novos arquivos em `preview-astro/instagram-kiraht/` (o primeiro vídeo vira o destaque; as fotos seguem a ordem dos nomes) e rode `python3 -I scripts/importar_instagram.py`. A Home é atualizada sozinha na prévia.
- A integração automática pela API (`src/lib/instagram.ts`) foi mantida no projeto, mas não aparece mais na Home.

## Efeitos 3D e acabamento visual
- **A bola 3D foi removida** (o Three.js foi desinstalado). No topo, o título ganhou mais destaque e foi para a esquerda; à direita entra uma colagem em camadas com três publicações da Kiraht, inteiras e na proporção original.
- **Efeitos 3D na rolagem (GSAP + ScrollTrigger com `scrub`)**: o movimento acompanha a rolagem nos dois sentidos, inclusive ao voltar para cima.
  - Topo: o fundo faz parallax e cresce levemente; o título recua em perspectiva; as três imagens se movem em velocidades e profundidades diferentes.
  - Títulos e textos sobem e ficam nítidos ao entrar.
  - Cards dos atletas começam “deitados” em perspectiva e ficam de frente.
  - Cards da equipe giram para o centro.
  - Vídeo e carrossel ganham profundidade ao entrar.
  - Transição entre seções: a seção que sai recua levemente.
  - Fichas: a foto em ação só reduz um pouco a escala e a opacidade ao sair (não corta nem distorce). Dados, trajetória e fonte entram em camadas.
- **Celular**: amplitude dos efeitos pela metade, e a inclinação por cursor fica desligada.
- **Movimento reduzido**: nenhum efeito é criado e o conteúdo aparece direto (ativado no código; não dá para simular no navegador de teste).
- **Desempenho**: sem tarefas longas na rolagem. O GSAP é o único script grande (47 KB gzip, em todas as páginas).
- Mantidos: botões com relevo e inclinação suave dos cards ao passar o cursor (desktop).

## Imagens de terceiros
| Arquivo | Origem | Autor | Licença |
|---|---|---|---|
| public/img/hero-estadio.jpg | https://unsplash.com/photos/ARU18GpF6QQ | Jonathan Petersson | Licença Unsplash, baixado em 19/11/2026 |
| public/fotos/* | Planilha do elenco 2026/27 fornecida pela Kiraht | — | Uso autorizado pela agência |
