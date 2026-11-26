# Vídeo #007: Caxias do Sul já se chamou Campo dos Bugres?

Duas versões, com o **Lauro** narrando e o **Piá** perguntando e provocando (revezamento: #006 Guria → #007 Piá):
- **A) Curto** (Reels / TikTok / Shorts): cerca de 1:20, vertical 9:16
- **B) Longo** (YouTube): cerca de 5:00, horizontal 16:9, com capítulos

**Tom:** curiosidade e carinho pela Serra. O trecho dos indígenas e dos bugreiros é **sóbrio, sem piada, sem efeito cômico e sem o Cusco**. O Piá fica sério nessa parte.
**Visual:** o Lauro de pilcha completa, com o lenço mostarda e uma blusa de lã por cima (é a Serra!). O Piá de boné azul para trás e camiseta listrada, sem escudo, com touca de lã na parte do frio. O cenário é a serra com parreirais, casas de pedra e de madeira e neblina. Mapas desenhados, **sem fotos de terceiros**.

---

## Novidades visuais deste vídeo

### 1. Selo do Cusco (carimbo de carta), bem no meio do vídeo
- O Cusco atravessa a tela correndo, para no centro e dá **um latido** (`latido.mp3`).
- Junto com o latido, um **selo postal** "cai" no meio da tela com um punch da câmera e o som de `carimbo.mp3`:
  - borda serrilhada de selo, fundo creme e o desenho do Cusco (orelha direita em pé, coração branco no peito, mini lenço mostarda);
  - por cima, um **carimbo redondo de correio** meio torto, com tinta vermelho-escura e linhas onduladas de cancelamento: `BAH, TU SABIA? · #007 · CAXIAS DO SUL`;
  - texto do selo: `🐕 CARIMBADO PELO CUSCO`.
- Fica cerca de 1,5 s na tela e sai girando, com `whoosh.mp3`. O Cusco sai correndo pelo outro lado (`patinhas.mp3`).
- Posição: no curto, em cerca de 0:40 (entre as falas L4 e P4); no longo, na virada para o capítulo "Pérola das Colônias" (cerca de 2:30).
- Componente novo: `SeloCusco` em `src/ui/Overlays.tsx`, reaproveitável nos próximos vídeos.

### 2. Métricas e gráficos, com moderação
- **No máximo uma métrica por fala**, e nunca em duas falas seguidas. Entre uma e outra, cena "normal" com personagem.
- Cada métrica dura de 2 a 4 s, com animação "de virada" (o número sobe contando, o termômetro desce, a barra cresce) e um som curto (`tictac`, `ding`, `plim`).
- Estilo: cards de canto arredondado, fundo escuro translúcido, número grande em Montserrat Black e **fonte pequena embaixo** (`Fonte: IBGE, Censo 2022`).
- **Só números confirmados** (ver "Conferir antes de publicar"). Quando o número é aproximado, a tela mostra `≈` ou "cerca de".

| Métrica | Tipo de gráfico | Valor na tela | Fonte |
|---|---|---|---|
| Altitude | Régua vertical subindo com a serra | `≈ 800 m` acima do mar | sites municipais (817 m); conferir |
| População | Barras: Porto Alegre × Caxias × Canoas | `463.338` (2ª maior do RS) | IBGE, Censo 2022 |
| Frio | Termômetro descendo | Julho: mínima média `≈ 8 °C` · Janeiro: máxima média `≈ 27 °C` | Climatempo (normais de 30 anos); conferir INMET |
| Distância (só no longo) | Estrada animada com marcador de km | `≈ 130 km` de Porto Alegre pela estrada | planejadores de rota; arredondar |
| Linha do tempo dos nomes | Placa de estrada trocando de nome | 1875 → 1877 → 1884 → 1890 → 1910 → 1944 | Wikipédia e fontes listadas |

---

## A) VÍDEO CURTO (cerca de 1:20)

| # | Quem | Fala | Tela |
|---|---|---|---|
| 1 | Lauro | **Bah, tu sabia** que Caxias do Sul já se chamou Campo dos Bugres? | Placa de estrada `CAXIAS DO SUL` gira e vira `CAMPO DOS BUGRES` (madeira velha). O Lauro caminhando na serra com neblina. |
| 2 | Piá | Campo dos o quê? Ainda bem que trocaram! | O Piá rindo, de mão na barriga. |
| 3 | Lauro | Era uma clareira com fontes de água… expulsos com violência pelos chamados bugreiros. | Clareira com olho d'água e trilha de tropeiros. **Virada para paleta escura e música baixa**: silhuetas na mata, sem rosto. Sem Cusco. |
| 4 | Piá | Bah… isso quase ninguém conta. | O Piá sério, tirando o boné. |
| 5 | Lauro | Em 1875, chegaram os imigrantes italianos… subiram a serra. | A luz volta. Mapa Itália (Vêneto) → navio → serra. **Métrica:** régua de altitude subindo junto com a família até `≈ 800 m`. |
| 6 | Piá | E foi aí que trocaram aquele nome? | O Piá apontando para a placa. |
| 7 | Lauro | Em 1877, virou Colônia Caxias… e o "do Sul" só veio em 1944. | A placa troca de nome a cada ano, com `pop`: `COLÔNIA CAXIAS · 1877` → `MUNICÍPIO · 1890` → `CAXIAS DO SUL · 1944`. |
| — | Cusco | *(latido)* | **SELO DO CUSCO** (carimbo de carta) no meio da tela, cerca de 0:40. |
| 8 | Piá | E hoje? Caxias é grande? | O Piá de olho no selo, que acabou de sair. |
| 9 | Lauro | Grande? É a segunda maior cidade do Rio Grande do Sul… | **Métrica:** barras crescendo, Porto Alegre `1.332.570` × Caxias `463.338`. `Fonte: IBGE, Censo 2022` |
| 10 | Piá | E lá todo mundo torce pro Grêmio, né? | O Piá com as mãos na cintura, cheio de si. |
| 11 | Lauro | Lá tem o Juventude e o Caxias, piá! Mas o que une todo mundo é a uva… | Duas faixas só com cores e nome: `JUVENTUDE` (verde e branco) e `CAXIAS` (grená). Depois, cacho de uva gigante, `🍇 FESTA DA UVA · 1931`. |
| 12 | Piá | E é verdade que lá é frio de bater o queixo? | O Piá de touca, tremendo (dentes batendo com `chocalho`). |
| 13 | Lauro | Bah, se é! Em julho, a mínima média fica perto de 8 graus. E às vezes até neva. | **Métrica:** termômetro descendo até `≈ 8 °C`; flocos de neve caindo. O Cusco tremendo com a orelha dobrada. |
| 14 | Lauro | Comenta aí: tu tem nono ou nona lá da Serra? | Lauro, Piá e Cusco lado a lado no parreiral; `COMENTA 👇` |

### CURTO · LAURO
```
[excited] Bah, tu sabia que Caxias do Sul já se chamou Campo dos Bugres?

Era uma clareira com fontes de água, lá no alto da serra, usada pelos indígenas e depois como pouso pelos tropeiros. [seriously] E tem uma parte triste: com a colonização, os indígenas que viviam ali foram expulsos com violência pelos chamados bugreiros.

[softly] Pois é. [warmly] Em 1875, chegaram os imigrantes italianos, a maioria camponeses do Vêneto. Atravessaram o oceano, subiram a serra por picadas no meio do mato, e cada família ganhou um pedaço de terra pra derrubar e plantar.

Foi! Em 1877, virou Colônia Caxias, em homenagem ao Duque de Caxias. Em 1890, virou município. E o "do Sul" só veio em 1944.

[laughs] Grande? É a segunda maior cidade do Rio Grande do Sul! Quase meio milhão de pessoas, segundo o Censo de 2022.

[laughs] Lá tem o Juventude e o Caxias, piá! Mas o que une todo mundo é a uva. Desde 1931 tem a Festa da Uva, e o vinho virou a cara da Serra.

[excited] Bah, se é! Em julho, a mínima média fica perto de 8 graus. E às vezes até neva.

[warmly] Comenta aí: tu tem nono ou nona lá da Serra?
```

### CURTO · PIÁ
```
[laughs] Campo dos o quê? Ainda bem que trocaram!

[softly] Bah… isso quase ninguém conta.

[curious] E foi aí que trocaram aquele nome?

[curious] E hoje? Caxias é grande?

[mischievously] E lá todo mundo torce pro Grêmio, né?

[curious] E é verdade que lá é frio de bater o queixo?
```
*(Cerca de 230 palavras no total, o que dá cerca de 1:15 a 1:25.)*

**Ordem das falas (para montar):** L1, P1, L2, P2, L3, P3, L4, *(selo do Cusco)*, P4, L5, P5, L6, P6, L7, L8.

---

## B) VÍDEO LONGO DO YOUTUBE (cerca de 5:00)

**Título sugerido:** `CAXIAS DO SUL JÁ SE CHAMOU CAMPO DOS BUGRES? A história da Pérola das Colônias`

### Capítulos (provisórios; ajusto depois da locução, todos com 10 s ou mais)
```
0:00 Caxias já se chamou Campo dos Bugres?
0:25 Quem vivia ali antes
1:00 1875: a viagem dos imigrantes
1:50 Os muitos nomes de Caxias
2:30 A Pérola das Colônias
3:15 O talian, a língua dos nonos
3:50 A Festa da Uva
4:25 O frio da Serra
4:50 Final
```

### LONGO · LAURO
```
[excited] Bah, tu sabia que Caxias do Sul já se chamou Campo dos Bugres?

[laughs] Pois tem história nesse nome, piá. E nesse vídeo eu vou te contar tudo: quem vivia lá antes, a viagem dos imigrantes italianos, os nomes que a cidade teve, a língua dos nonos e o frio de bater o queixo. Te aprochega, pega o mate.

Antes de ter cidade, ali no alto da serra tinha uma grande clareira com fontes de água. Era um lugar cortado por caminhos antigos dos indígenas. Depois, os tropeiros que andavam entre os Campos de Cima da Serra e o resto da província começaram a usar a clareira como pouso. Os exploradores chamavam aquilo de Campo dos Bugres.

[seriously] "Bugre" era um jeito ofensivo de chamar os indígenas. [softly] E tem uma parte triste dessa história: com a colonização, os indígenas que viviam na região foram expulsos com violência pelos chamados bugreiros, homens contratados pra isso. É uma página que por muito tempo ficou de fora da história contada.

[softly] É, piá. E é justo que a gente lembre deles quando fala da Serra.

[warmly] Em 1875, o Império criou ali uma colônia pra receber imigrantes italianos. A maioria era de camponeses do norte da Itália, principalmente do Vêneto, que fugiam da pobreza. Eles atravessaram o oceano de navio, subiram de barco pelos rios até onde dava, e depois encararam a serra por picadas no meio do mato, muitas vezes a pé e com tudo nas costas. Hoje, de Porto Alegre até lá, são uns cento e trinta quilômetros de estrada. Naquele tempo, era uma aventura.

[laughs] Boa parte, sim! E lá em cima, a cerca de oitocentos metros de altitude, cada família recebia um lote de terra coberto de mato. Tinha que derrubar, construir a casa e plantar, tudo do zero.

Calma, piá, que nome foi o que não faltou! Em 1877, a colônia passou a se chamar Colônia Caxias, em homenagem ao Duque de Caxias. Depois veio Santa Teresa de Caxias. Em 20 de junho de 1890, Caxias virou município. Em 1910, com a chegada do trem, ganhou o título de cidade. E o "do Sul" só veio em 1944, pra não confundir com outras Caxias do Brasil.

[proudly] Cresceu tanto que ganhou apelido: Pérola das Colônias, porque foi a colônia italiana que mais prosperou. Teve também quem chamasse de milagre das montanhas. Das roças e das pequenas oficinas dos imigrantes, a cidade virou um dos grandes polos industriais do estado.

E não parou mais. Pelo Censo de 2022, Caxias tem 463 mil moradores. É a segunda maior cidade do Rio Grande do Sul, só atrás de Porto Alegre.

[laughs] Lá tem o Juventude e o Caxias, piá! E é cada clássico... Mas tem uma coisa que une todo mundo por lá.

Também, mas eu tava falando da língua! Dos dialetos que os imigrantes trouxeram, misturados com o português, nasceu o talian. Ele é patrimônio cultural do Rio Grande do Sul por lei, e o IPHAN reconheceu o talian como Referência Cultural Brasileira em 2014.

[laughs] Bah, piá, eu sou da fronteira, não vou passar vergonha! Mas quem tem nono e nona da Serra sabe: deixa uma palavra em talian aí nos comentários.

E não dá pra falar de Caxias sem falar da uva. A Festa da Uva começou em 1931, e conta-se que a ideia foi de um português, Joaquim Pedro Lisboa, que trabalhava na ferrovia. Hoje é uma das festas mais conhecidas do Brasil, com desfile de carros alegóricos, uva e até a pisa da uva, com o pé, do jeito antigo.

[excited] Bah, se é! Em julho, a média das mínimas fica perto de 8 graus, e tem dia bem mais frio que isso. Tem geada, neblina, e às vezes até neve. Em compensação, no verão, a máxima média de janeiro fica perto de 27 graus.

[warmly] Então é isso: Campo dos Bugres, Colônia Caxias, Pérola das Colônias. Uma cidade feita de muita gente, dos que estavam lá antes e dos que chegaram de longe.

[warmly] Comenta aí: tu tem nono ou nona lá da Serra? E qual palavra em talian tu conhece? Se inscreve no canal, que aqui no Bah, tu sabia, toda semana tem história do Rio Grande. Valeu, tchê!
```

### LONGO · PIÁ
```
[laughs] Campo dos o quê? Tio, que nome é esse?

[curious] E por que "bugres"?

[softly] Bah… isso a escola não me contou.

[curious] E os italianos, chegaram quando?

[surprised] Tudo a pé?! Com mala e tudo?

[curious] E quando trocaram aquele nome?

[laughs] Bah, quanto nome! E aí a cidade cresceu?

[mischievously] E lá todo mundo torce pro Grêmio, né?

[mischievously] O vinho?

[excited] Fala alguma coisa em talian, tio!

[curious] E é verdade que lá é frio de bater o queixo?

Valeu, tio! Vou pedir pro meu nono me ensinar.
```

**Ordem das falas (para montar):** L1, P1, L2, L3, P2, L4, P3, L5, P4, L6, P5, L7, P6, L8, *(selo do Cusco)*, P7, L9, L10, P8, L11, P9, L12, P10, L13, L14, P11, L15, L16, L17, P12.

> Atenção na montagem: P1 ("Tio, que nome é esse?") vem logo depois de L1, e L2 responde. P2 ("E por que bugres?") vem depois de L3, e L4 responde. P3 ("isso a escola não me contou") vem antes de L5 ("É, piá…"). O selo do Cusco entra na virada para "A Pérola das Colônias", entre L8 e P7.

*(Cerca de 850 palavras no total, o que dá cerca de 5:00.)*

### Visual do longo (16:9)
- Cenário novo: **serra gaúcha** com coxilhas mais altas, araucárias, parreirais em fileira, casa de pedra e de madeira com lambrequim e neblina baixa. O Lauro e o Piá ficam à esquerda e o card à direita, como no #005.
- Abertura: a placa de estrada girando de `CAXIAS DO SUL` para `CAMPO DOS BUGRES`.
- Indígenas e bugreiros: **paleta escura, música baixa, sem efeitos cômicos e sem o Cusco**; silhuetas na mata, sem rosto.
- A viagem: mapa animado Itália (Vêneto) → oceano → rio → serra; família com malas subindo a picada. **Métricas:** régua de estrada com marcador (`≈ 130 km` de Porto Alegre) em L6 e régua de altitude (`≈ 800 m`) em L7, com a fala do Piá no meio.
- Os nomes: a placa trocando de nome a cada ano, com o trem chegando em 1910 (`apito`).
- **Selo do Cusco** na virada para "A Pérola das Colônias".
- Pérola das Colônias: uma pérola brilhando sobre o mapa, oficina virando fábrica. **Métrica:** barras de população (Porto Alegre × Caxias × Canoas).
- Futebol: faixas só com cores e nomes (`JUVENTUDE` verde e branco, `CAXIAS` grená), **sem escudo**.
- Talian: balões de fala com reticências (sem palavras inventadas) e `COMENTA UMA PALAVRA EM TALIAN 👇`.
- Festa da Uva: carro alegórico estilizado, cacho gigante e um pé pisando a uva (`agua`).
- Frio: **métrica do termômetro** descendo (julho `≈ 8 °C`) e subindo (janeiro `≈ 27 °C`), geada e flocos de neve. O Piá de touca e o Cusco tremendo.
- Final: o Lauro levantando a cuia no parreiral, com o Piá e o Cusco.

### Métricas por versão (para não cansar)
- **Curto (3):** altitude (L3), população (L5), termômetro (L7).
- **Longo (5):** distância (L6), altitude (L7), população (L10), termômetro (L15) e a linha do tempo dos nomes (L8, como placa e não como gráfico).

---

## Conferir antes de publicar
- **Campo dos Bugres:** nome dado pelos exploradores a uma clareira com fontes de água, cortada por caminhos indígenas e usada como pouso por tropeiros. Fonte: Wikipédia (História de Caxias do Sul).
- **Bugreiros:** a Wikipédia registra a expulsão violenta dos indígenas pelos "bugreiros". **Não citar etnia nem número de vítimas** sem fonte; conferir se é possível dizer qual povo vivia na região (fontes citam os Kaingang na Serra, mas não confirmei para o local exato).
- **"Bugre" como termo ofensivo:** é o uso corrente nas fontes sobre o tema. Manter a explicação curta.
- **1875 e o Vêneto:** colônia criada em 1875; a maioria dos imigrantes veio do norte da Itália, principalmente do Vêneto (fontes concordam). As três primeiras colônias: Conde d'Eu (Garibaldi), Dona Isabel (Bento Gonçalves) e Campo dos Bugres (Caxias).
- **O caminho até a serra (rio, picadas, a pé, lotes):** é a descrição corrente da colonização, mas **conferir em fonte** antes de publicar o "muitas vezes a pé" e o lote por família.
- **Nomes:** Campo dos Bugres (até 1877) → Colônia Caxias (11/04/1877) → Santa Teresa de Caxias (1884–1890) → município em 20/06/1890 → cidade em 1910, com o trem → "Caxias do Sul" em 1944. Uma reportagem dá 20 de julho de 1890 (parece erro) e outra cita o nome "Fundos de Nova Palmira" em 1875; o roteiro não usa esse nome.
- **Pérola das Colônias / milagre das montanhas:** apelidos citados pela Wikipédia.
- **População:** 463.338 no Censo 2022 (divulgação do Censo; a página do IBGE Cidades mostra 463.501). **Na tela, usar o número do IBGE Cidades no dia da edição** e dizer "quase meio milhão" / "463 mil" na fala. Porto Alegre 1.332.570; Canoas 347.657. Caxias é a 2ª do RS.
- **Altitude:** sites municipais dizem 817 m; não achei na prefeitura nem no IBGE. A fala diz "cerca de oitocentos metros", e a tela, `≈ 800 m`.
- **Distância:** de 127 a 130 km pela estrada, conforme a fonte; a fala diz "uns cento e trinta". Em linha reta, cerca de 96 km (não usar).
- **Frio:** normais da Climatempo: julho mínima 8 °C e máxima 17 °C; janeiro mínima 18 °C e máxima 27 °C. **Conferir no INMET** antes de pôr na tela. Neve: possível em algumas ondas de frio, **não todo ano** (o roteiro diz "às vezes").
- **Talian:** Lei estadual nº 13.178 (patrimônio do RS; conferir o ano, que acho ser 2009); IPHAN, Referência Cultural Brasileira em 2014. Caxias aparece em listas como cooficial; **não dito no roteiro** até confirmar. **Nenhuma palavra em talian na tela** sem fonte.
- **Festa da Uva:** primeira edição em 1931. A autoria da ideia (Joaquim Pedro Lisboa, português, funcionário da ferrovia) vem de uma fonte só; por isso o roteiro diz "conta-se". **Não citar público nem periodicidade** (as fontes divergem).
- **Futebol:** Juventude (verde e branco) e Caxias (grená): só cores e nome, sem escudo.

### Fontes consultadas
- Wikipédia: [História de Caxias do Sul](https://en.wikipedia.org/wiki/History_of_Caxias_do_Sul), [Caxias do Sul](https://en.wikipedia.org/wiki/Caxias_do_Sul), [Centro Histórico de Caxias do Sul](https://en.wikipedia.org/wiki/Historic_Center_of_Caxias_do_Sul), [Talian](https://www.wikipedia.org/wiki/Talian_dialect)
- [IBGE Cidades: Caxias do Sul](https://www.ibge.gov.br/cidades-e-estados/rs/caxias-do-sul.html) · [Jornal do Comércio: Censo 2022, cidades mais populosas do RS](https://www.jornaldocomercio.com/geral/2023/06/1112779-censo-2022-confira-as-cidades-mais-populosas-e-as-menos-populosas-do-rs.html)
- [Governo do RS: lei do talian como patrimônio](https://www.estado.rs.gov.br/governadora-sanciona-lei-que-declara-o-talian-dialeto-integrante-do-patrimonio-do-rs)
- [Monitor do Mercado: origem da Festa da Uva](https://monitordomercado.com.br/noticias/economia/421153-a-maior-festa-da-uva-do-pais-foi-criada-em-1931-por-um-portugues-inspetor-de-ferrovia-a-cidade-gaucha-erguida-por-camponeses-do-veneto/)
- [Climatempo: climatologia de Caxias do Sul](https://www.climatempo.com.br/climatologia/353/caxiasdosul-rs)
- [Cidade Brasil: Caxias do Sul](https://www.cidade-brasil.com.br/municipio-caxias-do-sul.html) · [Wikivoyage: Caxias do Sul](https://en.wikivoyage.org/wiki/Caxias_do_Sul)
- [InfoEscola: Caxias do Sul](https://www.infoescola.com/rio-grande-do-sul/caxias-do-sul/)
