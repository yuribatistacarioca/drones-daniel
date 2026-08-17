/* =========================================================
   Daniel Lima — Filmagem aérea com drones

   Três coisas só, de propósito:
   1. preloader com a marca se desenhando
   2. rolagem suave (Lenis)
   3. reveal simples ao rolar

   Sem GSAP, sem ScrollTrigger, sem SplitType: nada disso é
   necessário para isto, e cada biblioteca a menos é menos
   coisa para carregar antes do primeiro clique no WhatsApp.

   >>> ÚNICO LUGAR PARA TROCAR O NÚMERO OU A MENSAGEM: <<<
   ========================================================= */

const CONFIG = {
  whatsapp: '5512982186806',                      // 55 + DDD + número, só dígitos
  msg: 'Olá, Daniel! Vim pelo site e gostaria de um orçamento de filmagem aérea.'
};

const REDUZIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const linkWa = (texto = CONFIG.msg) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

/* Um destino só (o WhatsApp), com rótulos e mensagens diferentes por
   seção. O texto de cada botão vem do próprio HTML (data-msg), então o
   Daniel já recebe a conversa sabendo de onde a pessoa veio — quem
   clicou em "Quero filmar meu imóvel" chega dizendo isso. */
$$('[data-wa]').forEach((a) => {
  a.href = linkWa(a.dataset.msg || CONFIG.msg);
  a.target = '_blank';
  a.rel = 'noopener';
});
$('#ano').textContent = new Date().getFullYear();

/* =========================================================
   FORMULÁRIO — não envia nada. Monta a mensagem e abre o
   WhatsApp, para a pessoa conferir antes de mandar.
   ========================================================= */
const form = $('#form');
if (form) {
  const erro = $('#formErro');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => $(id).value.trim();
    const obrigatorios = [
      ['#fNome',   'nome'],
      ['#fTipo',   'o que filmar'],
      ['#fCidade', 'cidade']
    ];

    $$('.campo').forEach((c) => c.classList.remove('is-erro'));
    const faltando = obrigatorios.filter(([id]) => !val(id));

    if (faltando.length) {
      faltando.forEach(([id]) => $(id).closest('.campo').classList.add('is-erro'));
      erro.textContent = `Falta preencher: ${faltando.map(([, r]) => r).join(', ')}.`;
      erro.hidden = false;
      $(faltando[0][0]).focus();
      return;
    }

    erro.hidden = true;
    const linhas = [
      'Olá, Daniel! Vim pelo site.', '',
      `Nome: ${val('#fNome')}`,
      `O que quero filmar: ${val('#fTipo')}`,
      `Cidade: ${val('#fCidade')}`
    ];
    if (val('#fData')) linhas.push(`Quando: ${val('#fData')}`);
    if (val('#fObs'))  linhas.push('', `Detalhes: ${val('#fObs')}`);
    linhas.push('', 'Pode me passar um orçamento?');

    open(linkWa(linhas.join('\n')), '_blank', 'noopener');
  });
}

/* ---- mídia ausente vira espaço marcado, nunca ícone quebrado ---- */
$$('.midia video').forEach((v) => {
  const fig = v.closest('.midia');
  const nome = fig?.querySelector('figcaption')?.textContent.trim() || 'mídia';
  fetch(v.getAttribute('src'), { method: 'HEAD' })
    .then((r) => { if (!r.ok) throw 0; v.preload = 'metadata'; })
    .catch(() => {
      fig.classList.add('is-vazio');
      fig.dataset.falta = `falta o arquivo\n${nome}`;
    });
});

/* =========================================================
   1. PRELOADER
   O desenho da marca é CSS puro. Aqui só se cuida de sair de
   cena — com prazo máximo, para ninguém ficar presoNuma tela
   de carregamento se algo travar.
   ========================================================= */
const pre = $('#pre');

/* o navegador restaura a rolagem no reload; com preloader isso faria o
   site aparecer no meio da página */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.documentElement.classList.add('js');
document.body.classList.add('is-loading');
scrollTo(0, 0);

let saiu = false;
function revelar() {
  if (saiu) return;
  saiu = true;
  document.body.classList.remove('is-loading');
  if (!pre) return;
  pre.classList.add('is-fim');
  /* só sai do DOM depois da subida terminar, senão a cortina some de
     uma vez no meio do caminho */
  setTimeout(() => pre.remove(), 1150);
}

/* o mínimo para a marca terminar de se desenhar, e um teto absoluto */
addEventListener('load', () => setTimeout(revelar, REDUZIR ? 0 : 1500));
setTimeout(revelar, 4500);

/* =========================================================
   2. ROLAGEM SUAVE
   ========================================================= */
let lenis = null;
addEventListener('load', () => {
  if (REDUZIR || !window.Lenis) return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
  const passo = (t) => { lenis.raf(t); requestAnimationFrame(passo); };
  requestAnimationFrame(passo);
});

/* âncoras internas: com Lenis ativo, scrollIntoView não funciona */
$$('a[href^="#"]:not([href="#"])').forEach((a) => {
  a.addEventListener('click', (e) => {
    const alvo = document.querySelector(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(alvo, { offset: -20 })
          : alvo.scrollIntoView({ behavior: 'smooth' });
  });
});

/* =========================================================
   3. REVEAL AO ROLAR
   IntersectionObserver e uma classe: a transição é do CSS.
   Dispara um pouco antes da dobra, para o conteúdo já estar
   pronto quando entra — nunca "carregando" à vista.
   ========================================================= */
const alvos = $$('[data-reveal]');
if (REDUZIR || !('IntersectionObserver' in window)) {
  alvos.forEach((el) => el.classList.add('is-visivel'));
  $$('.col').forEach(animarAnalise);
} else {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visivel');
      if (e.target.classList.contains('col') ||
          e.target.classList.contains('contador') ||
          e.target.classList.contains('viral')) animarAnalise(e.target);
      obs.unobserve(e.target);            // entra uma vez só; repetir vira ruído
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  /* escalona os irmãos diretos para o bloco entrar em cascata */
  alvos.forEach((el) => {
    const irmaos = [...(el.parentElement?.children || [])].filter((n) => n.hasAttribute?.('data-reveal'));
    const i = irmaos.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
    obs.observe(el);
  });
}

/* =========================================================
   GRÁFICO DA ANÁLISE
   A barra cresce e o número conta quando a coluna entra na tela.
   Os valores vêm do HTML: quem edita a lista edita o número, e os
   dois nunca se contradizem.
   ========================================================= */
function animarAnalise(col) {
  const barra = col.querySelector('[data-barra]');
  if (barra) barra.style.width = `${barra.dataset.barra}%`;

  col.querySelectorAll('[data-contar]').forEach(contar);
}

/* sobe rápido e freia no fim — é o freio que faz o número parecer
   "chegar" em vez de simplesmente aparecer */
function contar(num) {
  const alvo = Number(num.dataset.contar);
  const milhar = num.dataset.formato === 'milhar';
  const escrever = (v) => {
    num.textContent = milhar ? v.toLocaleString('pt-BR') : v;
  };
  if (REDUZIR) { escrever(alvo); return; }

  const dur = milhar ? 1600 : 900;
  const inicio = performance.now();
  const passo = (agora) => {
    const t = Math.min((agora - inicio) / dur, 1);
    escrever(Math.round(alvo * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/* =========================================================
   INTERFACE
   ========================================================= */
/* Menu ganha fundo assim que a rolagem sai do topo.
   Uma sentinela de 1px, e não o hero inteiro: enquanto o hero estivesse
   à vista o menu seguiria transparente, e a assinatura ficava por cima
   do texto do próprio hero. */
const nav = $('#nav');
const hero = $('.hero');
if (nav && 'IntersectionObserver' in window) {
  const sentinela = document.createElement('span');
  sentinela.setAttribute('aria-hidden', 'true');
  sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:70px;pointer-events:none';
  document.body.prepend(sentinela);
  new IntersectionObserver(
    ([e]) => nav.classList.toggle('is-solido', !e.isIntersecting)
  ).observe(sentinela);
}

/* ação fixa: entra depois do hero, some quando o formulário está à vista */
const fixo = $('.fixo');
const cta = $('#orcamento');
if (fixo && hero && cta && 'IntersectionObserver' in window) {
  let passouHero = false, noCta = false;
  const sincroniza = () => fixo.classList.toggle('is-on', passouHero && !noCta);
  new IntersectionObserver(([e]) => { passouHero = !e.isIntersecting; sincroniza(); },
    { rootMargin: '-60% 0px 0px 0px' }).observe(hero);
  new IntersectionObserver(([e]) => { noCta = e.isIntersecting; sincroniza(); },
    { rootMargin: '0px 0px -15% 0px' }).observe(cta);
}

/* vídeos tocam só quando estão à vista — bateria e dados não são infinitos */
if ('IntersectionObserver' in window) {
  const olho = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      const v = e.target;
      e.isIntersecting ? v.play?.().catch(() => {}) : v.pause?.();
    });
  }, { rootMargin: '10% 0px' });
  $$('.midia video').forEach((v) => olho.observe(v));
}

/* FAQ: abrir uma fecha as outras */
const perguntas = $$('.q');
perguntas.forEach((q) => {
  q.addEventListener('toggle', () => {
    if (q.open) perguntas.forEach((o) => { if (o !== q) o.open = false; });
  });
});
