# diDeus Pinturas · site

Site estático (HTML, CSS e JavaScript), sem etapa de build.

## Estrutura
- `index.html` — a página (textos dos serviços, etapas e chamadas)
- `css/style.css` — todo o visual (cores do logo em `:root`)
- `js/site.js` — **WhatsApp, Instagram, fotos de trabalhos e depoimentos** (tudo no topo do arquivo)
- `img/` — logo e pinceladas · `img/trabalhos/` — coloque aqui as fotos das obras

## Colocar fotos de trabalhos
1. Salve as fotos em `img/trabalhos/` (JPG de até ~1600 px de largura deixa o site leve).
2. Em `js/site.js`, preencha a lista `TRABALHOS`:
   ```js
   const TRABALHOS = [
     { antes: "img/trabalhos/telhado-antes.jpg", depois: "img/trabalhos/telhado-depois.jpg", titulo: "Telhado lavado e pintado", tipo: "Telhado" },
     { foto: "img/trabalhos/fachada-1.jpg", titulo: "Fachada residencial", tipo: "Fachada" },
   ];
   ```
   Com `antes` e `depois`, a foto vira um comparador que se arrasta. O primeiro item aparece grande.

## Depoimentos
Preencha `DEPOIMENTOS` em `js/site.js` com feedbacks reais (com autorização do cliente). A seção aparece sozinha.

## Publicar no GitHub + Netlify
1. Crie um repositório no GitHub e envie esta pasta.
2. No Netlify: **Add new site → Import an existing project → GitHub**, escolha o repositório.
3. **Build command:** vazio · **Publish directory:** `/` (raiz) → **Deploy**.
