/* diDeus Pinturas · tudo que muda com frequência fica aqui em cima */

// Número do WhatsApp: 55 + DDD + número, só dígitos
const WHATSAPP = "5551992669105";
const INSTAGRAM = "https://www.instagram.com/dideus_pinturas/";

/* FOTOS DE TRABALHOS
   Coloque as fotos em img/trabalhos/ e liste aqui. Dois formatos:
   { foto: "img/trabalhos/fachada-1.jpg", titulo: "Fachada residencial", tipo: "Fachada" }
   { antes: "img/trabalhos/telhado-antes.jpg", depois: "img/trabalhos/telhado-depois.jpg", titulo: "Telhado lavado e pintado", tipo: "Telhado" }
   O primeiro da lista aparece grande. Se a lista ficar vazia, aparecem ilustrações que levam ao Instagram. */
const TRABALHOS = [
  { foto: "img/trabalhos/telhado-pintado.webp", titulo: "Telhado lavado e pintado", tipo: "Telhado" },
  { foto: "img/trabalhos/fachada-casa-verde.webp", titulo: "Fachada e muro", tipo: "Fachada" },
  { foto: "img/trabalhos/cimento-queimado-sala.webp", titulo: "Parede em cimento queimado", tipo: "Cimento queimado" },
  { foto: "img/trabalhos/portao-pintado.webp", titulo: "Portão pintado", tipo: "Portão" },
  { foto: "img/trabalhos/cimento-queimado-parede.webp", titulo: "Cozinha em cimento queimado", tipo: "Cimento queimado" },
  { foto: "img/trabalhos/fachada-casa-bege.webp", titulo: "Casa pintada por fora", tipo: "Fachada" },
  { foto: "img/trabalhos/porta-pintada.webp", titulo: "Porta com acabamento brilhante", tipo: "Portas" },
  { foto: "img/trabalhos/preparo-lixamento.webp", titulo: "Lixamento antes da pintura", tipo: "Preparo" },
  { foto: "img/trabalhos/pintura-interna-andamento.webp", titulo: "Pintura interna em andamento", tipo: "Interno" },
];

/* DEPOIMENTOS DE CLIENTES (só reais, com autorização do cliente)
   { nome: "Maria", local: "Pintura da fachada", texto: "Serviço caprichado..." }
   A seção só aparece quando houver pelo menos um. */
const DEPOIMENTOS = [];

/* ------------------------------------------------------------------ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (txt) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const OI = "Olá, diDeus Pinturas! Vim pelo site";

/* links de WhatsApp */
$$("[data-wa]").forEach((a) => {
  a.href = waLink(`${OI} e gostaria de um orçamento.`);
  a.target = "_blank"; a.rel = "noopener";
});
$$("[data-wa-servico]").forEach((a) => {
  a.href = waLink(`${OI} e quero um orçamento de *${a.dataset.waServico}*.`);
  a.target = "_blank"; a.rel = "noopener";
});
$("#year").textContent = new Date().getFullYear();

/* barra de progresso + botão flutuante */
const bar = $(".paint-progress-bar"), float = $(".wa-float"), hero = $(".hero");
let ticking = false;
function onScroll() {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
  const closeTop = $(".close").getBoundingClientRect().top;
  float.classList.toggle("show", scrollY > hero.offsetHeight * 0.7 && closeTop > innerHeight * 0.55);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- a casa: o rolo pinta ---------- */
(function house() {
  const svg = $("#house"), clip = $("#paint-clip"), roller = $("#roller"), hint = $("#hero-hint");
  if (!svg) return;
  const MIN = 40, MAX = 520, REST = 330;
  let x = MIN;
  const set = (v) => {
    x = Math.max(MIN, Math.min(MAX, v));
    clip.setAttribute("width", x);
    roller.setAttribute("transform", `translate(${x} 0)`);
  };
  set(MIN);

  // entrada: pinta tudo e volta até o meio, mostrando antes e depois
  let anim = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function tween(from, to, ms, done) {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      set(from + (to - from) * ease(t));
      if (t < 1) anim = requestAnimationFrame(step); else done && done();
    };
    anim = requestAnimationFrame(step);
  }
  const showHint = () => hint.classList.add("show");
  if (reduce) { set(REST); showHint(); }
  else setTimeout(() => tween(MIN, MAX, 1900, () => setTimeout(() => tween(MAX, REST, 900, showHint), 250)), 500);

  // arrastar
  const toSvgX = (clientX) => {
    const pt = svg.createSVGPoint(); pt.x = clientX; pt.y = 0;
    return pt.matrixTransform(svg.getScreenCTM().inverse()).x;
  };
  let drag = false, offset = 0;
  const start = (e) => {
    cancelAnimationFrame(anim);
    drag = true; roller.classList.add("dragging");
    offset = e.target.closest("#roller") ? x - toSvgX(e.clientX) : 0;
    if (!offset) set(toSvgX(e.clientX));
    svg.setPointerCapture(e.pointerId);
    hint.classList.remove("show");
  };
  roller.addEventListener("pointerdown", start);
  // com mouse, clicar em qualquer ponto da casa também move o rolo
  svg.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse" && !e.target.closest("#roller")) start(e); });
  svg.addEventListener("pointermove", (e) => { if (drag) set(toSvgX(e.clientX) + offset); });
  const end = () => { drag = false; roller.classList.remove("dragging"); };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
})();

/* ---------- galeria ---------- */
(function gallery() {
  const g = $("#gallery");
  if (TRABALHOS.length) {
    g.innerHTML = TRABALHOS.map((t, i) => {
      const cls = i === 0 ? "tile big" : "tile";
      const tag = t.tipo ? `<span class="tag">${esc(t.tipo)}</span>` : "";
      const cap = t.titulo ? `<div class="cap"><span>${esc(t.titulo)}</span></div>` : "";
      if (t.antes && t.depois) {
        return `<div class="${cls}"><div class="compare" role="slider" tabindex="0" aria-label="Antes e depois: ${esc(t.titulo || "")}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
          <img src="${esc(t.antes)}" alt="Antes" loading="lazy"><img class="after" src="${esc(t.depois)}" alt="Depois" loading="lazy"><span class="bar"></span></div>${tag}${cap}</div>`;
      }
      return `<a class="${cls}" href="${INSTAGRAM}" target="_blank" rel="noopener"><img src="${esc(t.foto)}" alt="${esc(t.titulo || "Trabalho da diDeus Pinturas")}" loading="lazy">${tag}${cap}</a>`;
    }).join("");
    $$(".compare", g).forEach(compare);
  } else {
    const arts = [
      ["big", "art-antes", "Antes e depois", "Veja no Instagram"],
      ["", "art-fachada", "Fachadas", "Ver projetos"],
      ["", "art-telhado", "Telhados", "Ver projetos"],
      ["", "art-cimento", "Cimento queimado", "Ver projetos"],
      ["", "art-interna", "Pintura interna", "Ver projetos"],
    ];
    g.innerHTML = arts.map(([size, art, tag, cap]) =>
      `<a class="tile ${size}" href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="${tag}: ver no Instagram"><span class="art ${art}"></span><span class="tag">${tag}</span><div class="cap"><span>${cap} →</span></div></a>`
    ).join("");
  }

  function compare(el) {
    const setX = (p) => { p = Math.max(0, Math.min(100, p)); el.style.setProperty("--x", p + "%"); el.setAttribute("aria-valuenow", Math.round(p)); };
    const fromEvent = (e) => { const r = el.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); };
    let on = false;
    el.addEventListener("pointerdown", (e) => { on = true; el.setPointerCapture(e.pointerId); fromEvent(e); });
    el.addEventListener("pointermove", (e) => on && fromEvent(e));
    el.addEventListener("pointerup", () => (on = false));
    el.addEventListener("keydown", (e) => {
      const v = parseFloat(el.getAttribute("aria-valuenow"));
      if (e.key === "ArrowLeft") setX(v - 5);
      if (e.key === "ArrowRight") setX(v + 5);
    });
  }
})();

/* ---------- depoimentos ---------- */
(function reviews() {
  if (!DEPOIMENTOS.length) return;
  $("#depoimentos").hidden = false;
  $("#review-list").innerHTML = DEPOIMENTOS.map((d) =>
    `<blockquote class="review reveal"><div class="stars" aria-label="5 estrelas">★★★★★</div><p>“${esc(d.texto)}”</p><footer>${esc(d.nome)}${d.local ? `<span>${esc(d.local)}</span>` : ""}</footer></blockquote>`
  ).join("");
})();

/* ---------- orçamento ---------- */
(function quote() {
  const form = $("#quote-form"), prev = $("#q-preview"), send = $("#q-send");
  const groups = $$(".chips", form);
  groups.forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest(".pick"); if (!b) return;
    if (g.hasAttribute("data-multi")) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    else $$(".pick", g).forEach((o) => o.setAttribute("aria-pressed", o === b && b.getAttribute("aria-pressed") !== "true"));
    update();
  }));
  $$("input", form).forEach((i) => i.addEventListener("input", update));

  const picked = (name) => $$(`[data-group="${name}"] .pick[aria-pressed="true"]`, form).map((b) => b.textContent.trim());
  function message() {
    const serv = picked("servico"), imovel = picked("imovel"), prazo = picked("prazo");
    const nome = $("#q-nome").value.trim(), local = $("#q-local").value.trim();
    const lines = [`${OI} e quero um orçamento.`];
    if (serv.length) lines.push(`• *Serviço:* ${serv.join(", ")}`);
    if (imovel.length) lines.push(`• *Imóvel:* ${imovel[0]}`);
    if (prazo.length) lines.push(`• *Prazo:* ${prazo[0]}`);
    if (local) lines.push(`• *Local:* ${local}`);
    if (nome) lines.push(`Meu nome é ${nome}.`);
    if (lines.length > 1) lines.push("Posso mandar fotos do local por aqui.");
    return lines.join("\n");
  }
  function update() {
    const m = message();
    prev.innerHTML = esc(m).replace(/\*(.+?)\*/g, "<b>$1</b>");
    send.href = waLink(m);
  }
  update();
})();

/* ---------- revelação ao rolar ---------- */
(function reveal() {
  $$(".sec-head, .swatch, .years-copy, .years-photo, .tile, .insta, .steps li, .quote-form, .phone, .close-inner").forEach((el) => el.classList.add("reveal"));
  const targets = [...$$(".reveal"), ...$$(".underline"), $(".process"), $(".close")];
  if (!("IntersectionObserver" in window) || reduce) { targets.forEach((t) => t.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      const el = en.target;
      el.classList.add("in"); io.unobserve(el);
      setTimeout(() => (el.style.transitionDelay = ""), 1000);
    }
  }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  targets.forEach((t) => io.observe(t));
  // escalonar cards da mesma linha
  $$(".swatches .swatch, .gallery .tile, .steps li").forEach((el, i) => (el.style.transitionDelay = `${(i % 3) * 70}ms`));
})();
