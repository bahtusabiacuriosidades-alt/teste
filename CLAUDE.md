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
- **Cusco:** vira-lata caramelo, **orelha direita em pé e esquerda dobrada**, mancha branca em forma de coração no peito, mini lenço mostarda. Aparece em cerca de 1 de cada 3 cenas, como alívio cômico ou reação. `CuscoRun` e `CuscoSit` (paw, tiltHead, chew) em `chars/Others.tsx`.

## Preferências do usuário (aprendidas na prática)
- **Mãos sempre com 5 dedos.** Nunca dedo único, que parece dedo do meio.
- **Câmera mais afastada**, mostrando o cenário. Personagens semi-realistas (sombreamento e proporções naturais), não cartoon chapado.
- **Personagem em movimento:** caminhar, pular, balançar. Evitar o Lauro parado.
- **Nada de "tela vazia":** se a fala demora a chegar no ponto, colocar algo acontecendo (ex.: o Cusco atravessando).
- **Escala coerente:** pessoa nunca do tamanho de prédio (usar perspectiva).
- **Efeitos sonoros em toda ação** (ex.: bola furando, latido, carimbo) e **música de fundo baixa** em todos os vídeos.
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
2. O usuário gera a locução no ElevenLabs e manda o MP3.
3. Rodar a preparação do áudio (dentro de `remotion/`):
   ```bash
   pip install faster-whisper librosa
   python3 tools/preparar_audio.py --id vXX --voz /caminho/audio.mp3 --acorde <seg_final> [--breque <seg_da_virada>] [--musica-lufs -35]
   ```
   Isso gera `public/audio/vXX_voz.mp3`, `public/audio/vXX_musica.mp3`, `src/data/vXX/words.json` e `src/data/vXX/rms.json`. **Conferir e corrigir as palavras da legenda.**
4. Criar `src/VideoXX.tsx` (copiar o mais parecido: `Video03.tsx` para passo a passo, `Video04.tsx` para história, `Video04L.tsx` para YouTube horizontal, `Video02.tsx` para tom sério) e registrar em `src/Root.tsx`.
5. Testar com quadros isolados (`npx remotion still … --frame=N --scale=0.3`), olhar e corrigir sobreposições.
6. Renderizar:
   ```bash
   npx remotion render src/index.ts VideoXX out/arquivo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --concurrency=4 --crf=20
   ```
   Depois ajustar o volume final para **cerca de −14 LUFS** (ffmpeg `volume=+xdB,alimiter`) e salvar em `videos/`.
7. Enviar legendas (Instagram, TikTok, YouTube) e o primeiro comentário para fixar.

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
| #005 | **História do Inter** (curto + YouTube) | `roteiro-video-05-inter.md` | roteiro pronto, aguardando MP3 do ElevenLabs |

Outros: stories em `stories/` (Tupanciretã e enquete Inter × Grêmio). Roteiros em `roteiro-video-*.md`. Análise dos vídeos de referência em `engenharia-reversa-videos.md` e `roteiro-video-03-chimarrao.md` (seção 1).
