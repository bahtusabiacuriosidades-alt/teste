# Bah, tu sabia? · memória do projeto

> Este arquivo é lido automaticamente pelo Claude Code ao abrir este repositório.
> **Branch de trabalho:** `claude/video-reverse-engineering-fjqw49`. Se a sessão abrir em outro branch, faça checkout dele antes de começar.
> **Idioma com o usuário:** português do Brasil, tom direto e amigável.

## O canal
Vídeos curtos (Reels/TikTok/Shorts) e longos (YouTube) sobre **cultura, dança, curiosidades e história do Rio Grande do Sul**.
- **Todo vídeo começa obrigatoriamente com "Bah, tu sabia…?"**, a primeira coisa falada e mostrada.
- Curtos: **1:00 a 1:30**, vertical 1080×1920. Longos do YouTube: **cerca de 5 min**, horizontal 1920×1080, com capítulos.
- Narração gerada pelo usuário no **ElevenLabs** (voz "Lauro", modelo v3/v4). O usuário manda o MP3 e eu monto o vídeo.
- Tudo é feito em **Remotion** (pasta `remotion/`). O usuário autorizou o uso de keyframes e animação procedural.

## Personagens (bíblia completa em `bah-tu-sabia-personagens-e-formato.md`)
- **Lauro:** gaúcho de cerca de 38 anos, chapéu preto de aba larga com barbicacho, **lenço amarelo-mostarda `#D9A021`**, camisa branca arregaçada, colete marrom, guaiaca com fivela de prata, bombacha cinza com favos, botas pretas. **A cuia fica sempre na mão direita** (lado esquerdo da tela). Componente: `remotion/src/chars/Lauro.tsx` (expressões: talk, shock, laugh, smile, squint, stern, angry, wink, delight, sad; poses: down, wave, hold, pointUp, thumbsUp, wag, pointSide, pointDown; props: walk, hop, lean, cuiaRaise, scarf).
- **Piá** (a partir do #005): guri de uns 10 anos, sobrinho do Lauro, gremista provocador, boné azul para trás e camiseta listrada sem escudo. Voz infantil masculina.
- **Guria** (a partir do #006): sobrinha do Lauro, uns 10 anos, curiosa e esperta. **Sempre vestida de prenda**: vestido longo rosa-claro com babados de renda, faixa com laço, tranças castanhas com fita e flor no cabelo. Componente `remotion/src/chars/Guria.tsx` (mesma API do Pia; braços: down, cross, shrug, count, present, hips, cheer, skirt; expressões: talk, smile, laugh, shock, smug, pout, sad). Prévia em `previa/guria_prenda.png`.
- **Revezamento:** um vídeo com a **Guria**, o seguinte com o **Piá**, e assim por diante (#006 Guria, #007 Piá…). Em **vídeos de dança**, os dois aparecem juntos. Voz infantil feminina, e precisa ser **voz de menina no ElevenLabs** (afinar a voz do Lauro não serve).
- **Cusco:** vira-lata caramelo, **orelha direita em pé e esquerda dobrada**, mancha branca em forma de coração no peito, mini lenço mostarda. Aparece em cerca de 1 de cada 3 cenas, como alívio cômico ou reação. `CuscoRun` e `CuscoSit` (paw, tiltHead, chew) em `chars/Others.tsx`.

## Preferências do usuário (aprendidas na prática)
- **Mãos sempre com 5 dedos.** Nunca dedo único, que parece dedo do meio.
- **Câmera mais afastada**, mostrando o cenário. Personagens semi-realistas (sombreamento e proporções naturais), não cartoon chapado.
- **Personagem em movimento:** caminhar, pular, balançar. Evitar o Lauro parado.
- **Nada de "tela vazia":** se a fala demora a chegar no ponto, colocar algo acontecendo (ex.: o Cusco atravessando).
- **Escala coerente:** pessoa nunca do tamanho de prédio (usar perspectiva).
- **Efeitos sonoros em toda ação** (ex.: bola furando, latido, carimbo) e **música de fundo baixa** em todos os vídeos.
- **Câmera em movimento** com `src/camera.tsx` (`<Cam shots punches>`): no máximo um movimento por fala, respiração leve entre os movimentos e punch só em impacto. Movimentado, sem cansar.
- Gosta de **animações "de virada"** (ex.: o xis cresce no "do tamanho de um prato").
- Gênero dos personagens secundários **segue a voz** do áudio (ex.: atendente com voz feminina = mulher).

## Regras que não mudam
- **Nunca inventar dados** (porcentagens, números de enquete, estatísticas). Usar só o que o usuário der ou o que eu confirmar em fonte.
- **Pesquisar e citar fontes** em fatos históricos. Quando as fontes divergem, falar "uma das versões". Listar no roteiro o que conferir.
- **Clubes de futebol:** só cores e nome. **Sem escudo, logo ou foto de jogador.**
- **Fotos de terceiros:** só com autorização e crédito. Não baixar fotos de jornal.
- **Tragédias e doações:** tom sóbrio, sem piada. **Nunca colocar chave Pix no vídeo**; mandar sempre para os canais oficiais e alertar sobre golpes.

## Fluxo de produção de um vídeo novo
1. Pesquisar o tema (WebSearch) e escrever o roteiro em `roteiro-video-XX-tema.md`: falas com tempo, tela, texto para o ElevenLabs com tags `[excited]`, `[laughs]`… e a lista do que conferir.
   **Formato padrão para mandar o texto do ElevenLabs no chat:** um bloco de código por personagem e por versão (ex.: `CURTO · LAURO`, `CURTO · PIÁ`, `LONGO · LAURO`, `LONGO · PIÁ`), **só o texto com as tags de fala** (`[excited]`, `[laughs]`…), um parágrafo por fala, na ordem. **Sem números, sem `01_L`, sem títulos de capítulo dentro do bloco.** Com um personagem só, um bloco por versão.
2. O usuário gera a locução no ElevenLabs e manda o MP3.
3. Rodar a preparação do áudio (dentro de `remotion/`):
   ```bash
   pip install faster-whisper librosa
   python3 tools/preparar_audio.py --id vXX --voz /caminho/audio.mp3 --acorde <seg_final> [--breque <seg_da_virada>] [--musica-lufs -35]
   ```
   Se o usuário mandar **um arquivo só** com todas as falas em sequência (como no #005), corte com `tools/separar_falas.py --voz … --words … --spec tools/spec/vXX.json --saida pasta/` (o spec lista o início de cada fala na ordem do áudio) e depois use o `montar_dialogo.py`. Se o Piá vier na voz do Lauro, use `--agudo P=3` (método "natural", tipo fita; o rubberband soou robótico). Para trocar só a voz de um vídeo já renderizado, use `--igualar falas_antigo.json`, renderize só o áudio (`--codec=wav`) e junte com a imagem antiga no ffmpeg.
   Se o diálogo passar de 1:30 no curto, acelerar o `dialogo.mp3` com `atempo` (até cerca de 1.15) e dividir os tempos do `falas.json` pelo mesmo fator (feito no #006). `--compactar` encurta pausas internas.
   Vídeo acima de 100 MB não sobe pro GitHub: recomprimir com x264 2-pass a cerca de 2000 kbps.
   Com dois personagens gravados separados (`01_L.mp3`, `02_P.mp3`…), rode antes `python3 tools/montar_dialogo.py --id vXX --pasta /caminho/falas` e use `out/tmp_vXX/dialogo.mp3` como `--voz`; ele também gera `src/data/vXX/falas.json` (quem fala quando).
   Isso gera `public/audio/vXX_voz.mp3`, `public/audio/vXX_musica.mp3`, `src/data/vXX/words.json` e `src/data/vXX/rms.json`. **Conferir e corrigir as palavras da legenda.**
4. Criar `src/VideoXX.tsx` (com câmera e mais de um personagem: `Video05.tsx` vertical e `Video05L.tsx` horizontal; ou copiar o mais parecido: `Video03.tsx` para passo a passo, `Video04.tsx` para história, `Video04L.tsx` para YouTube horizontal, `Video02.tsx` para tom sério) e registrar em `src/Root.tsx`.
5. Testar com quadros isolados (`npx remotion still … --frame=N --scale=0.3`), olhar e corrigir sobreposições.
6. Renderizar:
   ```bash
   npx remotion render src/index.ts VideoXX out/arquivo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --concurrency=4 --crf=20
   ```
   Depois ajustar o volume final para **cerca de −14 LUFS** (ffmpeg `volume=+xdB,alimiter`) e salvar em `videos/`.
7. Thumbnail do YouTube (vídeo longo): `src/Thumbs.tsx` (Stills `ThumbGremio`, `ThumbInter`), estilo chamativo (texto gigante com contorno e degradê, Lauro em close, emojis, borda neon). Exportar com `npx remotion still src/index.ts ThumbXX ../thumbnails/thumbXX.jpg --image-format=jpeg --jpeg-quality=92 --scale=1.5` (1920×1080, menos de 2 MB).
8. Enviar legendas (Instagram, TikTok, YouTube) e o primeiro comentário para fixar. Salvar em `legendas-video-XX-tema.md`. Capítulos do YouTube: cada um com **10 s ou mais** (senão o YouTube ignora).

## Padrões visuais
- Selo do canal (HUD): `BAH, TU SABIA? · #NNN` + categoria (componente `HUD` em `src/ui/Overlays.tsx`).
- Legenda: **uma palavra por vez**, branca; palavras gaúchas em mostarda (lista `GAUCHO` em `src/lib.ts`).
- Etiquetas: vermelho = problema/erro, verde = solução, mostarda = destaque.
- Fonte Montserrat servida localmente (`public/fonts`, `src/fonts.ts`), porque o navegador do render não acessa a internet.
- Áreas seguras no vertical: nada importante nos 250 px de cima nem nos 300 px de baixo.
- Efeitos sonoros em `public/sfx/` (gerados com ffmpeg): plim, whoosh, ding, pop, boing, toin, buzina, latido, patinhas, carimbo, erro, acerto, apito, fervura, agua, chocalho, tictac, aplauso, chuva, vento, sino, caminhao, bolafura, boom, riser, scratch.
- Trilha gaúcha original: `audio/trilha_gaucha_original.mp3` (cerca de 100 BPM; breques em 20.0 s e 116.0 s; acorde final em 154.82–157.8 s).

## Status dos vídeos
| Nº | Tema | Arquivos | Situação |
|---|---|---|---|
| #001 | Dicionário gaúcho (cacetinho, pechada…) | `videos/video01_bah_tu_sabia.mp4` · `Video01.tsx` | pronto |
| #002 | Como ajudar Tupanciretã (doações e golpes) | `videos/video02_tupancireta.mp4` · `Video02.tsx` | pronto (crédito da foto "reprodução" pendente) |
| #003 | Tu sabe cevar um mate? | `videos/video03_chimarrao.mp4` · `Video03.tsx` | pronto |
| #004 | História do Grêmio (curto + YouTube) | `videos/video04_gremio_curto.mp4`, `videos/video04_gremio_youtube.mp4` · `Video04.tsx`, `Video04L.tsx` | pronto |
| teaser | "Grêmio venceu a votação" (10 s) | `videos/teaser04_gremio_venceu.mp4` · `Teaser04.tsx` | pronto |
| #006 | O RS já foi um país? (Revolução Farroupilha), com a Guria | `videos/video06_farroupilha_curto.mp4` · `Video06.tsx`, cenas em `scenes/Farroupilha.tsx` | curto pronto; longo aguardando MP3 |
| #005 | História do Inter (curto + YouTube), com o Piá | `videos/video05_inter_curto.mp4`, `videos/video05_inter_youtube.mp4` · `Video05.tsx`, `Video05L.tsx` | pronto |

Outros: stories em `stories/` (Tupanciretã, enquete Inter × Grêmio e 500 seguidores: `Story500.tsx`, vídeo de 8 s + foto). Roteiros em `roteiro-video-*.md`. Análise dos vídeos de referência em `engenharia-reversa-videos.md` e `roteiro-video-03-chimarrao.md` (seção 1).
