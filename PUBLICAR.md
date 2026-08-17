# Como colocar o site no ar (passo a passo)

Tempo estimado: 20 minutos. Custo: R$ 0.

Você faz os cliques — eu não consigo criar contas nem apertar botões por
você. Mas cada tela está descrita como aparece.

---

## ANTES DE PUBLICAR

### 1. Os vídeos (é o que falta)

O site já funciona sem eles: onde falta mídia aparece um retângulo
escrito `ADICIONAR video-01.mp4`. Mas num portfólio de filmagem os vídeos
**são** o produto — publicar sem eles é publicar pela metade.

Veja `assets/LEIA-ME.txt` para os nomes exatos e o tamanho de cada um.

### 2. O WhatsApp já está ligado

Número `(12) 98218-6806` configurado, e todo botão abre a conversa com a
mensagem pronta. Se um dia mudar o número ou o texto, é **um lugar só**:
`script.js`, primeiras linhas, dentro de `CONFIG`.

### 3. O que sobe e o que NÃO sobe

Sobem para o GitHub:

```
index.html
styles.css
script.js
assets/
```

**NÃO suba a pasta `_arquivo-efeitos/`.** Ela guarda as cenas em 3D que
foram retiradas quando o nível de efeito baixou. Está tudo pronto e
testado lá dentro, com instruções de como voltar, caso um dia você
queira. Não faz parte do site publicado.

O site hoje carrega **uma única biblioteca** (Lenis, ~3 KB, a rolagem
suave). Sem GSAP, sem three.js. Isso é de propósito: cada biblioteca a
menos é menos coisa para baixar antes do primeiro clique no WhatsApp —
que é o que você paga para acontecer no tráfego pago.

### 4. O que este site NÃO tem, de propósito

- **Depoimentos.** O Daniel ainda não tem avaliação no Google. Depoimento
  de cliente inventado é publicidade enganosa (art. 37 do Código de Defesa
  do Consumidor) e quem responde é ele. No lugar entrou a seção
  "Por que confiar", com fatos verificáveis e o link do Instagram.
- **Preços.** Combinado com você — o valor sai na conversa. O FAQ explica
  isso de um jeito que empurra para o WhatsApp em vez de afastar.
- **Certificações.** Você pediu para não colocar.

**Quando os primeiros clientes avaliarem no Google**, me chame: eu troco a
seção "Por que confiar" por depoimentos reais, com nome e cidade. Enquanto
isso, vale o Daniel mandar esta mensagem para quem já atendeu:

> Oi, [nome]! Tudo bem? Tô montando meu site e queria colocar a opinião de
> quem já trabalhou comigo. Você toparia deixar uma avaliação no meu
> Google? São duas ou três linhas, do jeito que você falaria. Valeu demais!

---

## Passo 1 — Instalar o Git (uma vez só)

Abra o **PowerShell** e cole:

```bash
winget install --id Git.Git -e
```

Feche e reabra o PowerShell quando terminar.

---

## Passo 2 — Criar a conta no GitHub

Para garantir que abra no **Chrome** e não no Edge, cole no PowerShell:

```bash
Start-Process chrome "https://github.com/signup"
```

Crie a conta e confirme pelo e-mail. Anote o **nome de usuário**.

Depois crie o repositório:

```bash
Start-Process chrome "https://github.com/new"
```

- **Repository name**: `drones-daniel`
- Marque **Public**
- **NÃO** marque "Add a README file"
- Clique em **Create repository**

---

## Passo 3 — Enviar os arquivos

No PowerShell, um bloco de cada vez. Troque `SEU-USUARIO`.

```bash
cd "C:\Users\yuri\Claude Code\drones-daniel"
```

```bash
git init; git add .; git commit -m "Site Daniel Lima - filmagem aerea com drones"
```

Se pedir para se identificar:

```bash
git config --global user.email "seu@email.com"; git config --global user.name "Seu Nome"
```

e repita o commit. Depois:

```bash
git branch -M main; git remote add origin https://github.com/SEU-USUARIO/drones-daniel.git; git push -u origin main
```

---

## Passo 4 — Publicar na Vercel

```bash
Start-Process chrome "https://vercel.com/signup"
```

1. **Continue with GitHub** e autorize.
2. **Add New…** → **Project**.
3. Ache `drones-daniel` → **Import**.
4. Não mexa em nada (é site estático). Clique em **Deploy**.
5. Em ~40 segundos aparece o endereço, tipo `drones-daniel.vercel.app`.

---

## Passo 5 — Conferir no celular e no PC

- [ ] A abertura desenha a marca do drone e revela o site
- [ ] A rolagem é suave, sem travar
- [ ] As seções aparecem suavemente ao rolar, sem exagero
- [ ] No celular, o botão "Pedir orçamento" aparece SEM precisar rolar
- [ ] O verde-limão aparece SÓ nos botões — em nenhum outro lugar
- [ ] O capítulo 02 ("Do chão você vê o lugar") fica preso enquanto a
      imagem corre por trás, e solta sem cair sobre o capítulo seguinte
- [ ] O grão de filme aparece por cima de tudo, sutil
- [ ] Todos os botões abrem a mesma conversa no WhatsApp
- [ ] O formulário reclama se faltar campo, e depois abre o WhatsApp com
      a mensagem montada
- [ ] Os vídeos tocam sozinhos, mudos, quando entram na tela
- [ ] A rolagem está fluida, sem travar
- [ ] O mapa carrega escuro (invertido) e mostra o litoral
- [ ] Nenhum plano com "PLANO AUSENTE" sobrou
- [ ] A página não desliza para os lados em nenhum ponto

No PC, confira também a decupagem (capítulo 03): a página prende e os
planos passam para o lado.

---

## Depois: publicar mudanças

```bash
cd "C:\Users\yuri\Claude Code\drones-daniel"; git add .; git commit -m "Atualização"; git push
```

A Vercel republica sozinha.

---

## Quando comprar o domínio

1. Compre em registro.br (`.com.br`) ou Namecheap/GoDaddy (`.com`).
2. Vercel: **Settings** → **Domains** → digite o domínio → **Add**.
3. Copie os registros `A` e `CNAME` que a Vercel mostrar e cole no painel
   de DNS de onde comprou.
4. De 10 minutos a algumas horas. O HTTPS é automático.
5. Atualize a linha `canonical` no `index.html`.

---

## Para rodar tráfego pago

Antes de gastar o primeiro real, instale a medição de conversão:

- **Meta Pixel** ou **Google Ads tag**: cole o código antes de `</head>`.
- Marque como conversão o clique nos links de WhatsApp. No `script.js`,
  todo CTA passa pela mesma função (`linkWa`) — é ali que o evento deve
  ser disparado, num lugar só.

Me chame quando chegar nessa etapa que eu instalo.
