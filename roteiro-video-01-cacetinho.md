# Vídeo #001: "Pede um cacetinho em São Paulo pra ver"

**Série:** Bah, tu sabia? · **Categoria:** 🗣️ DICIONÁRIO GAÚCHO
**Duração-alvo:** cerca de 1:25 (entre 1:00 e 1:30) · **Formato:** 9:16 (1080×1920)
**Vozes:** ElevenLabs (ver seção 1) · **Personagens:** Lauro (narrador), Cusco e o atendente paulista (só uma fala)

---

## 1. Vozes no ElevenLabs

### Modelo recomendado
| Modelo | Quando usar |
|---|---|
| **Eleven v3** ⭐ | Primeira opção. É o mais expressivo e entende **tags de emoção** entre colchetes (`[excited]`, `[laughs]`, `[whispers]`…). É o que dá o "BAH!" com vida. |
| **Multilingual v2** | Alternativa, se o v3 variar demais o sotaque entre um trecho e outro. É mais estável e menos teatral. Nesse caso, use a **versão sem tags** do texto (seção 4). |

### Voz do Lauro: como conseguir
1. **Melhor resultado:** clonar uma **voz gaúcha real**, a sua ou a de alguém que **autorize** (Instant Voice Clone, com 1 a 3 min de áudio limpo, falando animado). Sotaque de verdade não tem como ser imitado.
2. **Biblioteca de vozes (Voice Library):** filtre por *Portuguese / Brazilian* e busque termos como "gaúcho", "sulista", "southern Brazil", "Rio Grande do Sul". Escolha uma voz masculina grave, quente e animada.
3. **Voice Design** (criar voz a partir de descrição): cole este texto.
   ```
   A 38-year-old man from Rio Grande do Sul, southern Brazil, speaking Brazilian
   Portuguese with a strong, authentic gaúcho accent and melodic southern intonation.
   Warm, friendly baritone voice, charismatic storyteller, energetic and playful,
   quick pace, smiles while talking, sounds like a good-humored countryman telling
   curiosities to friends around a fire. Clear, close-mic studio quality.
   ```
   Gere 3 ou 4 opções, escolha a que fala "Bah" e "tchê" mais natural e **salve como "Lauro"**. Use sempre essa mesma voz em todos os vídeos.

### Perfil da voz (o "personagem" da fala)
- **Energia:** alta no gancho e no pedido final, média nas explicações. Ele **sorri enquanto fala**.
- **Velocidade:** um pouco acelerada (cerca de 170 palavras/min), sem soar corrido.
- **Tom:** amigo contando novidade na roda de chimarrão. Nunca professor, nunca locutor de rádio.
- **Momentos especiais:** "pechada" **sussurrada**, com suspense, e a risada logo depois.

### Configurações sugeridas
> Os nomes e as opções podem mudar no ElevenLabs. Use como ponto de partida e ajuste de ouvido.

| Ajuste | Eleven v3 | Multilingual v2 |
|---|---|---|
| Estabilidade (Stability) | **Natural** (use **Creative** se quiser mais emoção; pode variar mais) | **35–45%** |
| Similaridade (Similarity) | — | **75–85%** |
| Exagero de estilo (Style) | — | **20–35%** |
| Speaker boost | — | **Ligado** |
| Velocidade (se disponível) | 1.05–1.10 | 1.05–1.10 |

### Voz do atendente paulista (só uma fala)
Escolha outra voz masculina jovem, com **sotaque paulistano**, e configure com **estabilidade baixa** para sair mais espantada. Fala: `[confused] Oi?! Cacetinho?!`

### Latido do Cusco
Use o gerador de **Sound Effects** do ElevenLabs:
`a single short happy bark from a medium-sized mutt dog, playful, close mic`
Gere também: `quick dog paws running on a tiled floor, 2 seconds`

### Dicas de geração
- **Gere em 4 blocos** (marcados na seção 3), não frase por frase. Assim a entonação fica contínua. Se um trecho sair ruim, gere de novo só aquele bloco.
- Use **as mesmas configurações** em todos os blocos e em todos os vídeos.
- **Pausas:** reticências (`…`) dão pausa curta. Um ponto final seguido de nova linha dá uma respiração.
- **Pronúncia:** se o modelo errar alguma palavra, troque só no texto enviado ao ElevenLabs (a legenda continua certa):
  - `xis`, se ler como "x", escreva **"xís"**
  - `Bah`, se sair "bá" curto demais, escreva **"Baaah"**
  - `tchê` costuma sair certo. Se não sair, escreva **"tchêê"**
- Exporte em **MP3 44.1 kHz** e mire a voz em cerca de **−14 LUFS** (padrão das redes).

---

## 2. Trilha de fundo

| Arquivo | Uso |
|---|---|
| `audio/fundo_video01_cacetinho_85s.mp3` | **Fundo deste vídeo** (85,2 s, −31 LUFS, cerca de 17 dB abaixo da voz) |
| `audio/fundo_generico_60s.mp3` | Fundo padrão de 60 s |
| `audio/trilha_completa_fundo_baixo.mp3` | Música inteira já baixa (158 s) |
| `audio/final_acorde.mp3` | Só o acorde final (3 s) |

- O **breque** (parada da música) está em **1:01,9** e deve cair logo antes de **"pechada"**.
- O **acorde final** começa em **1:22,2** e deve cair em "quem fala mais estranho".
- Se a locução do ElevenLabs sair mais longa ou mais curta, arraste a música até o breque ficar antes de "pechada" e reposicione o acorde no final com `final_acorde.mp3`.
- 💡 **Mais fácil:** depois de gerar as falas, me manda os MP3 que eu alinho a música no tempo exato e devolvo o áudio do vídeo já mixado.

---

## 3. Falas e cenas

**HUD fixo:** `BAH, TU SABIA? · #001` e `🗣️ DICIONÁRIO GAÚCHO` no canto superior esquerdo.
**Legenda:** uma palavra por vez, branca. Palavras gaúchas em amarelo-mostarda `#D9A021`.
**Tempos** estimados para cerca de 170 palavras/min. Depois de gerar o áudio, ajuste os cortes à fala real.

> Os prompts de imagem usam os blocos **[LAURO]** e **[CUSCO]** e o sufixo da bíblia (`bah-tu-sabia-personagens-e-formato.md`):
> sufixo `vertical 9:16 composition, cinematic warm lighting, high detail, no text, no watermark`.

---

### 🎙️ BLOCO A (Lauro), cenas 1 e 3 a 5

#### CENA 1 · 0:00–0:03,5 · GANCHO
**Fala (v3):** `[excited] Bah, tu sabia que se tu pedir um negrinho e dois cacetinhos numa padaria de São Paulo…`
**Tela:** `BAH, TU SABIA?` grande por 1 s. **Efeito sonoro:** "plim" da bomba na cuia junto com o "Bah".
**Imagem:**
```
[LAURO] in front of the glass display counter of a cozy traditional bakery in Porto
Alegre, baskets of crusty golden French rolls behind him, chest-up close framing,
shocked "wow" expression: wide eyes, raised eyebrows, mouth open in an O, cuia at chest
height. + sufixo
```
**Animação:** sobrancelhas sobem e a câmera se aproxima um pouco.

#### CENA 2 · 0:03,5–0:09,0 · O CHOQUE
**Fala (Lauro, continua):** `…vão te olhar muito torto?`
**Fala (ATENDENTE, voz paulista):** `[confused] Oi?! Cacetinho?!`
**Tela:** pílula `📍 SÃO PAULO`. **Efeito sonoro:** disco arranhando antes do "Oi?!".
**Imagem:**
```
A young bakery clerk in a busy São Paulo padaria, white cap and white apron, holding an
empty paper bag, extremely confused face, one eyebrow raised, head tilted, city
buildings through the window. 3D animated feature film style. + sufixo
```
**Animação:** inclina a cabeça e a boca mexe no "Oi?!".

#### CENA 3 · 0:09,0–0:17,4 · APRESENTAÇÃO
**Fala:** `[laughs] Pois é, tchê! Aqui no Rio Grande do Sul a gente tem um dicionário só nosso. Então te aprochega, que eu vou traduzir.`
**Tela:** pílula `TE APROCHEGA = CHEGA MAIS`
**Imagem:**
```
[LAURO] medium shot inside the Porto Alegre bakery, laughing then explaining with a
confident half smile, LEFT hand waving the viewer closer, cuia in RIGHT hand. + sufixo
```
**Animação:** ri, depois faz o gesto de "vem cá".

#### CENA 4 · 0:17,4–0:23,4 · CACETINHO
**Fala:** `Cacetinho é o pão francês. Aquele quentinho, de casquinha, que a gente compra de manhã cedo.`
**Tela:** `CACETINHO = PÃO FRANCÊS 🥖`. **Efeito sonoro:** "whoosh" e "ding" (repetir em cada tradução).
**Imagem:**
```
Close-up of a wicker basket full of steaming golden crusty Brazilian French rolls on a
bakery counter at early morning, [LAURO]'s LEFT hand lifting one roll. + sufixo
```
**Animação:** vapor subindo e a mão pegando o pão.

#### CENA 5 · 0:23,4–0:27,3 · NEGRINHO
**Fala:** `Negrinho é o brigadeiro. Sim, aquele mesmo, da festa de aniversário.`
**Tela:** `NEGRINHO = BRIGADEIRO 🍫`
**Imagem:**
```
[LAURO] at a colorful kids birthday party table full of chocolate brigadeiros in paper
cups, balloons behind, holding one brigadeiro up to the camera with his LEFT hand,
delighted. + sufixo
```

---

### 🎙️ BLOCO B (Lauro), cenas 6 a 10

#### CENA 6 · 0:27,3–0:34,0 · BERGAMOTA
**Fala:** `Bergamota é a tangerina. Ou mexerica. Ou poncã. Depende de onde tu é… mas aqui é bergamota e pronto.`
**Tela:** `BERGAMOTA = TANGERINA / MEXERICA / PONCÃ 🍊`
**Imagem:**
```
[LAURO] in a sunny backyard in southern Brazil under a tree full of ripe tangerines,
holding one tangerine in his LEFT hand, amused raised eyebrow. + sufixo
```
**Animação:** joga a bergamota para cima e pega de volta no "e pronto".

#### CENA 7 · 0:34,0–0:36,8 · SINALEIRA
**Fala:** `Sinaleira é o semáforo. Pros paulistas, o farol.`
**Tela:** `SINALEIRA = SEMÁFORO 🚦`
**Imagem:**
```
[LAURO] on a sidewalk in downtown Porto Alegre next to a traffic light showing red,
pointing up at it with his LEFT hand, cars waiting, old colorful buildings. + sufixo
```

#### CENA 8 · 0:36,8–0:47,0 · XIS
**Fala:** `E xis é o sanduíche. Mas não qualquer sanduíche, tchê: o xis gaúcho é do tamanho de um prato! Tem ovo, tem milho, tem ervilha… [laughs] é janta pra dois.`
**Tela:** `XIS = SANDUÍCHE (GIGANTE) 🍔`. Depois, etiquetas pequenas surgindo: `• OVO` `• MILHO` `• ERVILHA`
**Imagem:**
```
A giant Brazilian gaucho "xis" sandwich as big as a dinner plate: pressed round bun
overflowing with fried egg, beef patty, ham, cheese, corn, green peas, lettuce, tomato
and mayonnaise, on a table at a simple lancheria, [LAURO] behind it with wide eyes,
comically small next to the sandwich. + sufixo
```
**Animação:** a câmera recua devagar revelando o tamanho. Corte para um close do recheio em "ovo, milho, ervilha".

#### CENA 9 · 0:47,0–0:51,9 · TRI
**Fala:** `E quando uma coisa é muito boa, é tri. Tri bom, tri legal, tri gostoso.`
**Tela:** `TRI = MUITO 👍` (o "tri" aparece 3 vezes, uma em cada palavra)
**Imagem:**
```
[LAURO] sitting at the lancheria table taking a big bite of the giant xis sandwich,
eyes closed in delight, giving a thumbs up with his LEFT hand. + sufixo
```

#### CENA 10 · 0:51,9–0:57,9 · CAPAZ
**Fala:** `Agora, se alguém te disser "capaz!"… não é elogio, não. "Capaz" quer dizer "imagina", "de jeito nenhum".`
**Tela:** `CAPAZ! = IMAGINA! / DE JEITO NENHUM 🙅`
**Imagem:**
```
[LAURO] medium shot, playful stern face, wagging the index finger of his LEFT hand
side to side meaning "no way", cuia in RIGHT hand, bakery background. + sufixo
```
**Animação:** dedo balançando e cabeça dizendo "não".

---

### 🎙️ BLOCO C (Lauro), cenas 11 a 14 (a virada)

#### CENA 11 · 0:57,9–1:01,8 · SUSPENSE
**Fala:** `[mischievously] Mas a palavra que mais confunde quem vem de fora é essa…`
**Imagem:**
```
[LAURO] extreme close-up, suspicious squint with one eye half closed, crooked mustache,
dramatic side lighting, blurred bakery background. + sufixo
```
**Animação:** aproximação lenta e dramática.

#### CENA 12 · 1:01,8–1:03,3 · VIRADA (no breque da música)
**Fala:** `[whispers] pechada.`
**Tela:** congela o quadro da cena 11, tira um pouco da cor e mostra `PECHADA?` enorme em mostarda, tremendo.
**Efeito sonoro:** nenhum. O breque da música faz o silêncio.

#### CENA 13 · 1:03,3–1:07,9 · PECHADA
**Fala:** `[laughs] Pechada é batida de carro! "Bah, dei uma pechada na sinaleira." Entendeu agora?`
**Tela:** `PECHADA = BATIDA DE CARRO 🚗💥`. **Efeito sonoro:** "tóin" de batidinha leve e buzina curta.
**Imagem:**
```
Two small old cars in a very light comedic fender bender at a red traffic light in
Porto Alegre, tiny dent, nobody hurt, [LAURO] beside them with his LEFT hand on top of
his hat in disbelief, the other driver shrugging. + sufixo
```

#### CENA 14 · 1:07,9–1:11,5 · CUSCO
**Fala:** `[surprised] Ô, Cusco! Larga esse cacetinho que não é teu!`
**Efeito sonoro:** latido feliz e patinhas correndo (ElevenLabs Sound Effects).
**Tela:** selo `🐕 O CUSCO APROVOU`
**Imagem:**
```
[CUSCO] snatching a golden French roll from a bakery basket with his mouth and running
away happily, ears flapping, [LAURO] in the background outraged, pointing at the dog
with his LEFT hand. + sufixo
```

---

### 🎙️ BLOCO D (Lauro), cenas 15 e 16 (fechamento)

#### CENA 15 · 1:11,5–1:15,4 · FRASE DE EFEITO
**Fala:** `[warmly] Aqui a gente não fala errado, tchê. A gente fala gaúcho.`
**Tela:** a frase inteira em destaque, em duas linhas.
**Imagem:**
```
[LAURO] outside the bakery at golden hour, proud smile, raising the cuia with his RIGHT
hand like a toast, [CUSCO] sitting at his feet happily chewing the French roll. + sufixo
```

#### CENA 16 · 1:15,4–1:25,2 · PEDIDO DE COMENTÁRIO + FIM
**Fala:** `[excited] Agora comenta aí: como é que chama o pão francês na tua cidade? Quero ver quem fala mais estranho! E segue pra mais bah!`
**Tela:** `COMO CHAMA NA TUA CIDADE? 👇`, depois `SEGUE PRA MAIS BAH! 🧉`
**Música:** o acorde final entra em cerca de 1:22,2, no "estranho".
**Imagem:**
```
[LAURO] outside the bakery at golden hour, winking and pointing down with his LEFT
hand, cuia in RIGHT hand, [CUSCO] at his feet tilting his head at the camera. + sufixo
```

---

## 4. Textos prontos para colar no ElevenLabs

### Versão Eleven v3 (com tags)

**Bloco A (Lauro)**
```
[excited] Bah, tu sabia que se tu pedir um negrinho e dois cacetinhos numa padaria de São Paulo… vão te olhar muito torto?
```
**Atendente (outra voz)**
```
[confused] Oi?! Cacetinho?!
```
**Bloco A, continuação (Lauro)**
```
[laughs] Pois é, tchê! Aqui no Rio Grande do Sul a gente tem um dicionário só nosso. Então te aprochega, que eu vou traduzir.
Cacetinho é o pão francês. Aquele quentinho, de casquinha, que a gente compra de manhã cedo.
Negrinho é o brigadeiro. Sim, aquele mesmo, da festa de aniversário.
```
**Bloco B (Lauro)**
```
Bergamota é a tangerina. Ou mexerica. Ou poncã. Depende de onde tu é… mas aqui é bergamota e pronto.
Sinaleira é o semáforo. Pros paulistas, o farol.
E xis é o sanduíche. Mas não qualquer sanduíche, tchê: o xis gaúcho é do tamanho de um prato! Tem ovo, tem milho, tem ervilha… [laughs] é janta pra dois.
E quando uma coisa é muito boa, é tri. Tri bom, tri legal, tri gostoso.
Agora, se alguém te disser "capaz!"… não é elogio, não. "Capaz" quer dizer "imagina", "de jeito nenhum".
```
**Bloco C (Lauro)**
```
[mischievously] Mas a palavra que mais confunde quem vem de fora é essa…
[whispers] pechada.
[laughs] Pechada é batida de carro! "Bah, dei uma pechada na sinaleira." Entendeu agora?
[surprised] Ô, Cusco! Larga esse cacetinho que não é teu!
```
**Bloco D (Lauro)**
```
[warmly] Aqui a gente não fala errado, tchê. A gente fala gaúcho.
[excited] Agora comenta aí: como é que chama o pão francês na tua cidade? Quero ver quem fala mais estranho! E segue pra mais bah!
```

### Versão Multilingual v2 (sem tags)
Use o mesmo texto **sem nada entre colchetes**. A emoção vem da pontuação: use `!` no gancho e no final, e `…` antes de "pechada". Gere "pechada." sozinho, com estabilidade mais alta, para soar mais baixo e misterioso.

*(Cerca de 230 palavras no total, o que dá aproximadamente 1:20 a 1:28 de áudio.)*

---

## 5. Publicação
- **Capa:** Lauro com a cara de "BAH!" e o texto `PÃO FRANCÊS AQUI É CACETINHO?!`
- **Legenda do post:** `Pede um cacetinho em SP pra ver o que acontece 😂🧉 Como chama na tua cidade?`
- **Hashtags:** `#bahtusabia #riograndedosul #gaucho #dicionariogaucho #rs #curiosidades #cacetinho`
- **Comentário fixado:** `E aí… bolacha ou biscoito? 👀`
- **Rótulo:** ative "conteúdo gerado por IA" (imagem e voz são de IA).

## 6. Checklist de edição
- [ ] A primeira coisa falada é "Bah, tu sabia".
- [ ] O vídeo fica entre 1:00 e 1:30.
- [ ] O breque da música cai logo antes de "pechada" e o acorde final no "estranho".
- [ ] A voz está em cerca de −14 LUFS e a música cerca de 17 dB abaixo.
- [ ] Nenhum plano passa de 4 s sem mudar algo. Nas falas longas (cenas 3 e 8), use dois planos.
- [ ] As palavras gaúchas estão em mostarda na legenda.
- [ ] A cuia está sempre na mão direita do Lauro. O Cusco tem a orelha direita em pé e o coração no peito.
