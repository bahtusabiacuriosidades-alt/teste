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
- **Piá** (a partir do #005): guri de uns 10 anos, sobrinho do Lauro, gremista provocador, boné azul para trás e camiseta listrada sem escudo. Voz infantil masculina (ver a voz escolhida no passo 2 do fluxo).
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
- **Selo do Cusco (a partir do #007):** bem no meio de todo vídeo, o Cusco atravessa, late e um **selo postal** cai no centro como carimbo de carta (borda serrilhada, desenho do Cusco, carimbo redondo `BAH, TU SABIA? · #NNN · TEMA`, texto `🐕 CARIMBADO PELO CUSCO`), com `latido` + `carimbo` + punch; fica cerca de 1,5 s. Componente `SeloCusco` em `src/ui/Overlays.tsx`.
- **Chamada final "comenta a tua cidade" (pedida no #007):** no fim do vídeo, o Lauro pede pra comentar o nome da cidade, e **a mais curtida vira o próximo vídeo**. Tem card `COMENTA 👇 A TUA CIDADE · A MAIS CURTIDA É O PRÓXIMO VÍDEO` e o comentário fixado abre a votação. Antes de escolher o próximo tema, perguntar ao usuário qual cidade ganhou.
- **Métricas e gráficos (a partir do #007):** termômetros, réguas, barras, contadores e marcadores de km, **às vezes**: no máximo uma por fala, nunca em duas falas seguidas, de 2 a 4 s, com animação de virada e a fonte pequena embaixo. Cerca de 3 no curto e 5 no longo. Só números confirmados (regra de não inventar dados vale aqui também).

## Regras que não mudam
- **Nunca inventar dados** (porcentagens, números de enquete, estatísticas). Usar só o que o usuário der ou o que eu confirmar em fonte.
- **Pesquisar e citar fontes** em fatos históricos. Quando as fontes divergem, falar "uma das versões". Listar no roteiro o que conferir.
- **Clubes de futebol:** só cores e nome. **Sem escudo, logo ou foto de jogador.**
- **Fotos de terceiros:** só com autorização e crédito. Não baixar fotos de jornal.
- **Tragédias e doações:** tom sóbrio, sem piada. **Nunca colocar chave Pix no vídeo**; mandar sempre para os canais oficiais e alertar sobre golpes.

## Fluxo de produção de um vídeo novo
1. Pesquisar o tema (WebSearch) e escrever o roteiro em `roteiro-video-XX-tema.md`: falas com tempo, tela, texto para o ElevenLabs com tags `[excited]`, `[laughs]`… e a lista do que conferir.
   **Formato padrão para mandar o texto do ElevenLabs no chat:** um bloco de código por personagem e por versão (ex.: `CURTO · LAURO`, `CURTO · PIÁ`, `LONGO · LAURO`, `LONGO · PIÁ`), **só o texto com as tags de fala** (`[excited]`, `[laughs]`…), um parágrafo por fala, na ordem. **Sem números, sem `01_L`, sem títulos de capítulo dentro do bloco.** Com um personagem só, um bloco por versão.
2. **Locução:** posso gerar direto pelo conector do ElevenLabs (`mcp__ElevenLabs__creative_generate_speech`, modelo `eleven_v4`, `generations_count: 1`), usando a conta do usuário:
   - Lauro: voice_id `S1mGcMJVmL8CL3VZAVos` (voz clonada do usuário)
   - Guria: voice_id `33B4UnXyTNbgLmdEDh5P` ("Keren – Sweet, Vibrant and Rhythmic")
   - Piá: voice_id `9EeK37hO7iJiXi8aJfRG` ("Luan"), **sempre +3 semitons** depois de gerar (método tipo fita: `montar_dialogo.py --agudo P=3`), escolhida pelo usuário. Amostra: `audio/teste_api/pia_luan_mais_jovem.mp3`. Rejeitada: "Jonas" (parece o Stitch). O ElevenLabs bloqueia criar voz de criança.
   Gerar **uma fala por chamada**, consultar `creative_get_flow_run_status` até terminar e baixar o `content_url` com curl. Nunca repetir uma geração para "tentar de novo" (cobra de novo). Antes de um vídeo inteiro, avisar o custo aproximado (o teste de 6 s custou cerca de 111 créditos; o plano Creator tem cerca de 121 mil por mês). Mandar uma prévia do áudio para o usuário aprovar antes de montar.
   Alternativa: o usuário gera no aplicativo e manda o MP3.
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

## Personagens em 3D (em teste, nov/2026)
> ⏸️ **PAUSADO pelo usuário (27/11/2026): voltamos aos vídeos em 2D** (personagens SVG em `remotion/src/chars/`). Não usar 3D nos próximos episódios até o usuário pedir. Tudo abaixo fica guardado para quando ele quiser retomar; o melhor ponto de partida é a amostra v3 com os modelos do Tripo.
> ⚠️ **DESCARTADO pelo usuário (27/11/2026):** o Lauro 3D feito com a forma do Hunyuan3D + textura projetada (`public/3d/lauro*.glb`, `tools/lauro3d.py`, prévias em `previa/3d/modelos/`) **não deve ser usado** em vídeo: o usuário achou o resultado estranho, com o rosto feio e borrado. Vamos recomeçar o 3D do zero, por outro caminho, ainda a definir com o usuário. O que ainda pode ser reaproveitado: as folhas de personagem 3D aprovadas (`previa/3d/turnaround_*.png`), os recortes (`public/img/3d/`) e as técnicas dos scripts (esqueleto por script, corte da axila, boca com 8 formas, `tools/visemas.py`), se surgir um modelo de qualidade melhor.

- Folhas de personagem 3D (frente, ¾, perfil, costas) geradas no ElevenLabs com Nano Banana Pro (`gemini-3-pro-image`, 2K, cerca de 1.830 créditos por imagem) em `previa/3d/`. Flow do ElevenLabs: `DYbkVWkvY9FAmKfRtXu3`. A folha do Cusco foi espelhada para a orelha direita ficar em pé.
- **Falso 3D no Remotion** (`src/Teste3D.tsx`): recortes sem fundo (rembg, modelo `isnet-general-use`) em `public/img/3d/`; vira de vista apertando no eixo X; queixo articulado pelo `rms.json` (componente `Pic`, campo `jaw`); aceno com antebraço separado (`lauro_aceno_braco.png`, pivô 292,246). Vistas de estúdio levam o filtro `WARM` para casar com o fim de tarde.
- O ElevenLabs não gera modelo 3D (.glb). Para 3D de verdade: passo a passo em `guia-modelos-3d.md` (Hunyuan3D + Blender + Mixamo; Cusco sem Mixamo).
- **Lauro 3D de verdade (forma):** gerado no Hunyuan3D-2.1 ("Gen Shape"; o "Gen Textured Shape" estoura a cota grátis). O .glb veio **sem normais** (aparece preto): corrigir com trimesh antes de usar. Malha corrigida em `public/3d/lauro_forma.glb`.
- **Esqueleto no Blender por script** (o Mixamo falhou): `pip install bpy` (Blender 5.3) e `python3 tools/rig_lauro.py public/3d/lauro_forma.glb public/3d/lauro_rig.glb`. Monta 19 ossos, pesos automáticos, apaga a bomba duplicada e cria as animações `parado`, `andar`, `acenar`, `pular`, `falar`, `bah`, `mate`. Prévia: `previa/3d/modelos/lauro_rig_animacoes.mp4`.
- **Lauro 3D completo (cor + boca):** `python3 tools/lauro3d.py public/3d/lauro_forma.glb public/3d/lauro.glb` (cerca de 45 s). Textura 2048 projetada das vistas da folha (frente/costas/perfis) com z-buffer, alinhamento linha a linha (DTW) e máscara da cuia; boca cortada na linha dos lábios (Z 0,6525, X −0,015, meia largura 0,046), com fundo, dentes e língua; 8 morph targets: `abrir, largo, redondo, apertar, fv, sorriso, labio_cima, labio_baixo`. Mesmas 7 ações. **Axilas:** a malha do Hunyuan3D vem com braço e tronco fundidos (Z 0,22 até o ombro); o script corta a axila com um plano inclinado, tampa os dois lados e corrige os pesos, senão o colete estica ao levantar o braço. Aceno: braço até a horizontal + cotovelo para cima (prévia `lauro3d_aceno_corrigido.mp4`). **Rosto:** ilha UV própria projetada de frente (cerca de 7x mais texels), pintado só pela vista de frente (os perfis criavam bigode fantasma e o barbicacho cruzando a cara), leitura bilinear e nitidez leve (prévia `lauro3d_rosto.png`). Prévias: `previa/3d/modelos/lauro3d_cor.png` e `lauro3d_labial_teste.mp4`.
- **Sincronia labial sem programa externo:** `tools/visemas.py` (regras do português sobre o `words.json` + volume do `rms.json`) gera os pesos por quadro. O Rhubarb Lip Sync foi bloqueado pelo ambiente (executável baixado), não usar.
- **Piá:** imagem de frente para o Hunyuan3D em `previa/3d/para_hunyuan/pia_frente_hunyuan.png` (recorte em `public/img/3d/pia_frente.png`). Aguardando o usuário mandar o .glb ("Gen Shape").
- **Vistas separadas para o Tripo (27/11):** 16 imagens em `previa/3d/vistas/` (`{lauro,pia,guria,cusco}_{frente,costas,lado_direito,lado_esquerdo}.png`, fundo branco). Frente, costas e lado direito foram recortados das folhas aprovadas; o lado esquerdo foi gerado no ElevenLabs com a folha como referência (cerca de 1.830 créditos cada; o do Cusco foi gerado como lado direito da folha original e espelhado). Resumo: `_resumo_16_vistas.png`. Brutas em `previa/3d/vistas/brutas/`. Plano: o usuário gera os modelos no Tripo pago e manda os .glb.
- **Modelos do Tripo (27/11), APROVADOS para seguir:** o usuário gerou os 4 no Tripo pago (cerca de 140 MB e 4,8 milhões de triângulos cada, sem esqueleto). Baixados do Drive com `gdown` e reduzidos para 100 mil triângulos com `python3 tools/reduzir_glb.py entrada.glb saida.glb 100000` (rodar um por vez: os 4 juntos estouram a memória). Ficam em `public/3d/tripo/{lauro,pia,guria,cusco}_tripo.glb` (5 a 12 MB), em escala de 1 unidade de altura, Y para cima e frente para +Z. Renders em `previa/3d/tripo/`. Os originais de 140 MB não sobem pro GitHub (passam de 100 MB). Pendências: esqueleto, boca e linhas claras finas nas emendas da textura.
- **Amostra com os 4 falando (27/11):** `videos/amostra3d_personagens_falando.mp4` (12,8 s, vertical, −14 LUFS). Falas reaproveitadas do #006 (Lauro e Guria) e do #007 (Piá e Lauro), sem gastar crédito. Passos:
  1. `python3 tools/personagem3d.py <nome> public/3d/tripo/<nome>_tripo.glb public/3d/tripo/<nome>_anim.glb` (Lauro, Piá, Guria): corta a linha da boca, interior (fundo, dentes, língua), 8 formas de boca, 19 ossos com **pesos próprios por distância ao osso** (o peso automático do Blender falha nas malhas do Tripo, que são várias peças soltas), tudo acima do pescoço preso na cabeça; ações `parado`, `falar`, `ouvir`, `bah`. Medidas de boca e ossos em `tools/spec3d/personagens.json` (`abrir_ang` = quanto o queixo desce).
  2. `python3 tools/amostra3d.py out/amostra3d`: linha do tempo (falas, legendas, bocas por quadro com `tools/visemas.py`) e áudio.
  3. Render em Three.js no Chromium do sistema (`tools/amostra3d/amostra.html` + `amostra.js`, cerca de 4 min para 384 quadros), com fundo `FundoCoxilha` (Still no Remotion) e sombra no chão; depois ffmpeg e −14 LUFS.
  - **v2 (27/11):** `videos/amostra3d_v2_andando_dedos.mp4`: entram caminhando (passo pela distância, sem escorregar), dedos mexem ao gesticular, Cusco trota/late. Render: `tools/amostra3d/amostra2.html` + `amostra2.js` (câmera é função só do tempo).
  - **Dedos:** ossos `dedos1/dedos2/polegar` por mão (os 4 dedos dobram juntos), medidas em `maos` no `personagens.json` (punho, nós, ponta, polegar e caixa do polegar). Mão direita do Lauro sem dedos (segura a cuia). Ação `andar` também no `personagem3d.py`.
  - **Pesos (lições):** braço/mão seguem SÓ o braço (a mão ao lado da coxa pegava peso do quadril e virava "espinhos"); a mão inteira (punho até a ponta) conta como braço; perto da mão, o que tem **cor de pele na textura** é mão e o tecido (bombacha/bolso) fica na perna; roupa larga longe do osso da perna segue 70% o quadril.
  - **Cusco:** `python3 tools/cusco3d.py public/3d/tripo/cusco_tripo.glb public/3d/tripo/cusco_anim.glb` (14 ossos: quadril, tórax, pescoço, cabeça, 2 do rabo, 2 por pata), ações `parado`, `trote` (pares diagonais), `latir`.
  - **v3 expressões (27/11):** `videos/amostra3d_v3_expressoes.mp4` (18,8 s). Rosto: 8 formas novas no `personagem3d.py` (`piscar_d`, `piscar_e`, `sobr_sobe_d`, `sobr_sobe_e`, `sobr_franze`, `sobr_triste`, `arregalar`, `olhos_apertar`), com olhos/sobrancelhas medidos em `rosto` no `personagens.json` (D = direita do personagem, X negativo). O piscar desce a pálpebra até a linha do olho e para abaixo da sobrancelha; usar no máximo 0,85 (fechado de vez mostra riscos). Gestos novos: `apontar`, `rir`, `ombros`, `tremer`, `cintura`, `sermao` (crianças espelham os dois braços; o Lauro segura a cuia). Direção de cena (quem, quando, gesto, expressão) e presets de rosto em `tools/amostra_expr.py`; render `tools/amostra3d/amostra_expr.html` (piscadas automáticas a cada 2,5–4,5 s; câmera fecha em quem fala).
  Pendências: linhas claras finas em emendas da textura; riscos no olho totalmente fechado; sorriso forte abre falhas nos cantos da boca do Piá (usar até 0,6).
- **Para o Mixamo (27/11):** `previa/3d/mixamo/{lauro,pia,guria}_mixamo.fbx` (sem esqueleto, textura embutida, altura 1,75 m o Lauro e 1,35 m as crianças; gerados com `tools/exportar_mixamo.py`) e os GLB leves `*_leve.glb` (inclui o Cusco). O Mixamo não aceita GLB nem quadrúpedes.
- Vídeo por IA custa caro: cerca de 2.100 créditos por 5 s no Kling 2.5 Turbo e 14.000 no Seedance 2.5.

## Padrões visuais
- Selo do canal (HUD): `BAH, TU SABIA? · #NNN` + categoria (componente `HUD` em `src/ui/Overlays.tsx`).
- Legenda: **uma palavra por vez**, branca; palavras gaúchas em mostarda (lista `GAUCHO` em `src/lib.ts`).
- Etiquetas: vermelho = problema/erro, verde = solução, mostarda = destaque.
- Fonte Montserrat servida localmente (`public/fonts`, `src/fonts.ts`), porque o navegador do render não acessa a internet.
- Áreas seguras no vertical: nada importante nos 250 px de cima nem nos 300 px de baixo.
- Efeitos sonoros em `public/sfx/` (gerados com ffmpeg): plim, whoosh, ding, pop, boing, toin, buzina, latido, patinhas, carimbo, erro, acerto, apito, fervura, agua, chocalho, tictac, aplauso, chuva, vento, sino, caminhao, bolafura, boom, riser, scratch, passo.
- Cenário da Serra `SerraWorld` (`scenes/Caxias.tsx`): coxilhas, araucárias, neblina, parreiral, casa de colono; props `cold` e `snow` para o frio.
- Cenário do pôr do sol `GuaibaWorld`: usar `flags="rs"` (bandeirinhas nas cores do RS) em vídeos que não são do Inter; o padrão (vermelho e branco) é só do #005.
- Trilha gaúcha original: `audio/trilha_gaucha_original.mp3` (cerca de 100 BPM; breques em 20.0 s e 116.0 s; acorde final em 154.82–157.8 s).

## Status dos vídeos
| Nº | Tema | Arquivos | Situação |
|---|---|---|---|
| #001 | Dicionário gaúcho (cacetinho, pechada…) | `videos/video01_bah_tu_sabia.mp4` · `Video01.tsx` | pronto |
| #002 | Como ajudar Tupanciretã (doações e golpes) | `videos/video02_tupancireta.mp4` · `Video02.tsx` | pronto (crédito da foto "reprodução" pendente) |
| #003 | Tu sabe cevar um mate? | `videos/video03_chimarrao.mp4` · `Video03.tsx` | pronto |
| #004 | História do Grêmio (curto + YouTube) | `videos/video04_gremio_curto.mp4`, `videos/video04_gremio_youtube.mp4` · `Video04.tsx`, `Video04L.tsx` | pronto |
| teaser | "Grêmio venceu a votação" (10 s) | `videos/teaser04_gremio_venceu.mp4` · `Teaser04.tsx` | pronto |
| #006 | O RS já foi um país? (Revolução Farroupilha), com a Guria | `videos/video06_farroupilha_curto.mp4`, `videos/video06_farroupilha_youtube.mp4` · `Video06.tsx`, `Video06L.tsx`, cenas em `scenes/Farroupilha.tsx` · thumb e legendas prontas | pronto |
| #005 | História do Inter (curto + YouTube), com o Piá | `videos/video05_inter_curto.mp4`, `videos/video05_inter_youtube.mp4` · `Video05.tsx`, `Video05L.tsx` | pronto |
| #007 | Caxias do Sul já se chamou Campo dos Bugres? (com o Piá) | `videos/video07_caxias_curto.mp4`, `videos/video07_caxias_youtube.mp4` · `Video07.tsx`, `Video07L.tsx`, cenas e métricas em `scenes/Caxias.tsx` (`SerraWorld`, `MetricAltitude`, `MetricKm`, `MetricPop`, `MetricTermo`) · selo `SeloCusco` · thumb `thumbnails/thumb07_caxias.jpg` · legendas prontas · áudios em `audio/v07/` | pronto |
| teste 3D | Protótipo "falso 3D" (10 s): Lauro e Cusco recortados das folhas 3D | `videos/teste3d_lauro_falso3d.mp4` · `Teste3D.tsx` · recortes em `public/img/3d/` · folhas em `previa/3d/` | só teste |
| Lauro 3D (.glb) | Modelo do Hunyuan3D com esqueleto, cor e boca | `public/3d/lauro.glb` · `tools/lauro3d.py` | **descartado**: recomeçar do zero |

Outros: stories em `stories/` (Tupanciretã, enquete Inter × Grêmio e 500 seguidores: `Story500.tsx`, vídeo de 8 s + foto). Roteiros em `roteiro-video-*.md`. Análise dos vídeos de referência em `engenharia-reversa-videos.md` e `roteiro-video-03-chimarrao.md` (seção 1).
