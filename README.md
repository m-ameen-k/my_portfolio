# Ameen K — Portfolio

Personal portfolio for Ameen K, showcasing [Fara'id Pro](https://github.com/m-ameen-k/Islamic-Inheritance-Calculator) (an Islamic inheritance calculator) and WireMirror (a low-latency Android screen-mirroring project).

**Live:** https://m-ameen-k.github.io/

## Stack

No build step, no frameworks — plain HTML, CSS and JavaScript.

- **Background** — a GPU-rendered particle galaxy built with [Three.js](https://threejs.org/) and a custom shader, layered over a static CSS nebula gradient. It loads after the rest of the page, and the site works fully without it if the script is blocked or fails to load.
- **Fonts** — Unbounded for headings, Manrope for body text, via Google Fonts.
- **Résumé** — generated on demand from the page's own content (name, About text, skills, contact links, and the top project cards), then laid out with dedicated print styles and handed to the browser's print dialog. Editing a project on the page keeps the résumé in sync automatically — no separate file to maintain.
- **Accessibility** — a skip-to-content link, visible focus states, semantic sections, and full support for `prefers-reduced-motion` (turns off the boot animation, scroll reveals, and the galaxy's motion).

## Local setup

Clone the repo and open `index.html` directly, or serve it locally:

```bash
git clone https://github.com/m-ameen-k/my_portfolio.git
cd my_portfolio
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. An internet connection is needed for the Google Fonts and Three.js includes.

## Deployment

Static site, deployed with GitHub Pages from this repository.

## Features

- Responsive single-page layout with smooth-scroll section navigation
- Scroll-triggered reveal animations, skipped entirely under reduced-motion
- Auto-generated, print-ready résumé built straight from the live page content
- Dark "galaxy" visual identity with a lavender accent
