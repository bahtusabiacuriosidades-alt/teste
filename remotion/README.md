# Bah, tu sabia? — vídeos em Remotion

Projeto que gera os vídeos do canal inteiramente em código: personagens, cenários, animações (keyframes), legenda palavra por palavra, HUD, etiquetas, efeitos sonoros e mixagem.

## Comandos
```bash
npm install
npm run studio      # abre o editor visual do Remotion no navegador (pré-visualizar e ajustar)
npm run render:01   # renderiza o vídeo #001 em out/video01_bah_tu_sabia.mp4
```
> Neste ambiente o render usa o Chromium já instalado (`--browser-executable`). No seu computador, pode remover essa opção: o Remotion baixa o navegador sozinho.

## Estrutura
| Caminho | O que tem |
|---|---|
| `src/Video01.tsx` | **Linha do tempo do #001**: as 16 cenas (início/fim em segundos), câmera, etiquetas, efeitos sonoros e áudio |
| `src/chars/Lauro.tsx` | O Lauro: expressões (`talk`, `shock`, `laugh`, `smile`, `squint`, `stern`, `angry`, `wink`, `delight`), poses do braço (`down`, `wave`, `hold`, `pointUp`, `thumbsUp`, `wag`, `pointSide`, `pointDown`), objetos na mão, corpo inteiro (`full`) e a cuia **sempre na mão direita** |
| `src/chars/Others.tsx` | O Cusco (correndo e sentado, com a orelha direita em pé, o coração no peito e o lenço mostarda) e o atendente paulista |
| `src/scenes/Backgrounds.tsx` | Cenários: padaria gaúcha, padaria SP, cesta de pão, festa, pátio com bergamoteira, rua com sinaleira, lancheria e xis, fachada no pôr do sol, carros |
| `src/ui/Overlays.tsx` | HUD `BAH, TU SABIA? · #001`, pílulas de tradução, etiquetas, texto grande, frase de efeito, carimbo e legenda |
| `src/lib.ts` | Funções de keyframe (`kf`), easing, sincronia labial pela voz, palavras gaúchas em mostarda |
| `src/data/words.json` | Tempo de cada palavra da locução (gera a legenda) |
| `src/data/rms.json` | Volume da voz por quadro (move a boca dos personagens) |
| `public/audio/` | Voz (ElevenLabs, normalizada) e música alinhada |
| `public/sfx/` | Efeitos sonoros gerados (plim, whoosh, ding, disco, pop, boing, tóin, buzina, latido, patinhas, carimbo) |

## Como fazer o próximo vídeo
1. Gere a locução no ElevenLabs e me mande o MP3. Eu gero `words.json`, `rms.json`, a música alinhada e a voz normalizada.
2. Copie `Video01.tsx` para `Video02.tsx`, troque as cenas e os textos e registre em `src/Root.tsx`.
3. `npx remotion render src/index.ts Video02 out/video02.mp4`.

## Animando por keyframe
```tsx
// valor que vai de 1.0 a 1.15 entre 0 s e 5,7 s da cena, com ease-in-out
<Cam z={kf(lt, [[0, 1.0], [5.7, 1.15]])}>
```
`t` é o tempo absoluto do vídeo e `lt` o tempo dentro da cena, os dois em segundos.
