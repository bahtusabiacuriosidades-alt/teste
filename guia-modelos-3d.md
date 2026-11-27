# Guia · Como fazer os modelos 3D de verdade (custo zero)

Objetivo: transformar as folhas de personagem (`previa/3d/turnaround_*.png`) em arquivos **`.glb`** com esqueleto e animações, para usar no Remotion com `@remotion/three`.

Caminho: **imagem → modelo 3D (Hunyuan3D) → ajuste (Blender) → esqueleto e animações (Mixamo) → juntar tudo (Blender) → `.glb` → Remotion**.

Tudo é gratuito. Só precisa de contas grátis no Hugging Face e na Adobe (para o Mixamo) e do Blender instalado no computador.

---

## Passo 0 · Preparar as imagens (eu faço)
As ferramentas que transformam imagem em 3D funcionam melhor com **uma imagem só, de frente, sem fundo e com o personagem inteiro**.
- Eu recorto a **vista de frente** de cada personagem, sem fundo, em PNG.
- A cuia vai sair "grudada" na mão do Lauro. Para nós isso é bom, porque ela fica sempre na mão direita.
- **Atenção:** o Mixamo prefere os braços um pouco afastados do corpo (pose em "A"). O Piá e a Guria já estão assim. O Lauro está com os braços mais colados. Se o Mixamo errar o esqueleto dele, eu gero uma vista de frente em pose "A" (cerca de 1.830 créditos).

## Passo 1 · Gerar o modelo 3D (Hunyuan3D, grátis)
1. Entre no Hugging Face e crie uma conta grátis.
2. Abra o espaço oficial **tencent/Hunyuan3D-2** (huggingface.co/spaces/tencent/Hunyuan3D-2). Se estiver fora do ar, procure por "Hunyuan3D" ou "TRELLIS" nos *Spaces*.
3. Suba a imagem de frente.
4. Deixe marcada a opção de **textura** e clique em gerar. Pode ter fila: a cota grátis de placa de vídeo é limitada por dia.
5. Baixe o resultado em **`.glb`**.
6. Gere 2 ou 3 vezes e fique com o melhor. Confira as **mãos** (5 dedos), o **rosto**, a **aba do chapéu** e as **costas**.

Alternativas com créditos grátis por mês: Meshy e Tripo. É bom conferir os limites antes.

## Passo 2 · Ajustar no Blender (grátis)
1. Baixe o **Blender** em blender.org e instale.
2. Apague o cubo inicial (tecla X) e vá em `File > Import > glTF 2.0 (.glb)`.
3. Confira se o modelo está **em pé, de frente para o eixo −Y**, com os pés no chão (Z = 0). Se precisar, gire e mova.
4. Se o arquivo estiver muito pesado, use `Modifiers > Decimate` para reduzir.
5. Exporte em **FBX** (`File > Export > FBX`):
   - `Path Mode: Copy` e clique no **ícone de "embed"** ao lado, para a textura ir junto no arquivo.
   - O Mixamo **não aceita `.glb`**, só FBX, OBJ ou ZIP.

## Passo 3 · Esqueleto e animações (Mixamo, grátis)
1. Entre em mixamo.com com uma conta Adobe grátis.
2. Clique em **Upload Character** e suba o FBX.
3. Posicione as bolinhas no **queixo, pulsos, cotovelos, joelhos e virilha**.
4. Em *Skeleton LOD*, escolha a opção **com dedos** (*Standard Skeleton*). Clique em Next e confira se o boneco mexe direito.
5. Escolha as animações. Sugestão para o canal:
   - *Walking* (caminhar)
   - *Waving* (acenar)
   - *Talking* (falar gesticulando)
   - *Jump* (pulo)
   - *Idle* (parado respirando)
   - *Pointing* (apontar)
   - *Surprised* (o "BAH!")
6. Baixe cada animação em **FBX, 30 fps**:
   - A primeira **With Skin** (com o corpo).
   - As outras **Without Skin** (só o movimento).
7. Para as crianças, o Mixamo tem a opção *In Place*: o personagem anda sem sair do lugar, e eu movo ele no Remotion.

## Passo 4 · O Cusco (o mais difícil)
O Mixamo só funciona com gente, não com bicho de quatro patas. Opções:
- **Cinevva Auto Rigger**, grátis no navegador: diz aceitar quadrúpedes e exporta `.glb`. É um site menor, vale testar.
- **Tripo**: tem esqueleto automático para quadrúpedes. É preciso conferir o limite grátis.
- Se nada der certo, o Cusco continua no **falso 3D** do teste. Como ele aparece pouco e rápido, funciona bem.

## Passo 5 · Juntar tudo num arquivo só (Blender)
1. Abra um arquivo novo no Blender e importe o FBX **With Skin**.
2. Importe cada animação **Without Skin**, uma por vez.
3. Na janela **Action Editor** (dentro do Dope Sheet), renomeie cada ação: `andar`, `acenar`, `falar`, `pular`, `parado`, `apontar`, `bah`.
4. Ligue todas as ações ao esqueleto principal (botão *Push Down*, que manda cada uma para o NLA) e apague os esqueletos extras que vieram junto.
5. Exporte em `File > Export > glTF 2.0`, formato **glTF Binary (.glb)**, com *Animation* marcado.
6. Nome do arquivo: `lauro.glb`, `pia.glb`, `guria.glb`, `cusco.glb`.

## Passo 6 · Rosto e boca (fase 2, opcional)
O modelo do Hunyuan3D vem com o rosto "fixo", sem boca que abre nem olhos que piscam.
- **Caminho simples:** usar o corpo 3D para andar, pular e acenar, e o **falso 3D com boca articulada** (do `Teste3D.tsx`) nos closes em que ele fala.
- **Caminho completo:** criar no Blender *shape keys* (boca aberta, piscar, sorriso). Exige aprender um pouco de escultura no Blender.

## Passo 7 · Me mandar os arquivos (eu faço o resto)
- Coloque os `.glb` na pasta `remotion/public/3d/` e faça o commit, ou me mande pelo chat. Limite do GitHub: 100 MB por arquivo.
- Eu instalo o `@remotion/three` e crio os componentes `Lauro3D`, `Pia3D`, `Guria3D` e `Cusco3D`, com escolha de animação, posição, câmera, luz de fim de tarde e sombra.
- Renderização aqui no servidor: `--gl=swangle` (sem placa de vídeo, mais lenta).

---

### Tempo estimado
- Primeiro personagem: **uma tarde** (aprendendo).
- Os outros: cerca de **1 hora cada**.

### Problemas comuns
| Problema | Solução |
|---|---|
| Mixamo não aceita o arquivo | Exportar de novo do Blender em FBX com a textura embutida, ou em OBJ. |
| Esqueleto torto | Usar uma imagem em pose "A" (braços afastados) e gerar o 3D de novo. |
| Mãos derretidas ou dedos colados | Gerar de novo no Hunyuan3D, ou corrigir no Blender (modo *Sculpt*). |
| Textura borrada | Usar a imagem de frente em 2K e gerar com textura no modo de mais qualidade. |
