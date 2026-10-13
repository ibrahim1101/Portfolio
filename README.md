# Shaik Ibrahim — Cinematic Cybersecurity Portfolio

A standalone React + Vite portfolio with a Three.js planetary hero, interactive project explorer, dedicated project pages, engineering timelines, screenshot gallery/lightbox, resource links, skills and documentation library. No backend or Emergent subscription required.

## Windows quick start

Install Node.js 20+ (Node.js 22 recommended). Open PowerShell in this folder:

```powershell
npm install
npm run dev
```

Open the local URL displayed by Vite (normally http://localhost:5173).

## Production build

```powershell
npm run build
npm run preview
```

The static production website is in `dist/`.

## Deploy free

- **Cloudflare Pages / Netlify / Vercel**: import the repository; build command `npm run build`; output directory `dist`.
- **GitHub Pages**: deploy the `dist` folder with GitHub Actions. This website uses `HashRouter` and relative Vite asset paths so nested project pages survive refreshes.

## Customize

- `src/data.js`: project descriptions, statuses, features, journey and resource links.
- `src/style.css`: design tokens and layout.
- `src/Scene.jsx`: Three.js hero environment.
- `public/media/projects/<slug>/`: project screenshots; add `gallery.json` as shown in `public/media/projects/README.md`.
- `public/documents/`: master guides and other public PDFs; link them from `src/data.js`.
- `src/main.jsx`: site sections, routing and interactions.

The placeholder `hello@example.com` email is **not a real contact address**. Replace it with your preferred email before publishing, or replace the contact button with your actual LinkedIn profile. No personal contact details were guessed.

## Important content notes

The portfolio is based on repository documentation available at initial creation. Project features and release states change. Check each repository's active development branch and releases before publishing. Conceptual interactive illustrations are not live integrations. Screenshot galleries remain empty until real assets are provided. No credentials or private evidence should be committed.

## Design/performance

The planetary scene is rendered with React Three Fiber and Drei. A CSS fallback is shown when reduced motion is requested or WebGL context is lost. Rendering resolution is capped to reduce GPU load. Google Fonts are optional external assets; system fonts are used if unavailable.

## Next milestones

1. Import verified screenshots and master-guide PDFs for each project.
2. Add project-specific 3D engineering demonstrations and deeper technical architecture diagrams.
3. Expand milestone content from each repository's engineering history.
4. Add resume PDF, verified contact information, custom domain, SEO metadata and performance testing.


## v0.4 Black Hole Hero
Hero now uses the supplied black-hole reference image with a subtle rotating CSS accretion overlay, ambient shimmer, responsive typography protection, and reduced-motion support. The motion is a stylized 2.5D effect, not a physically simulated black hole.


## v0.5 — orbit fix and socials

The project planets now use viewport-relative container units (`cqw`) for actual orbit radii, instead of percentages of each planet's own width. Planet labels counter-rotate to remain upright.

Set your four public social URLs in `src/socials.js`. Icons with null URLs are deliberately non-clickable until configured.


## v0.7 — Video wallpaper
The 4K black-hole wallpaper is stored at `public/media/black-hole.mp4`. It is used as a muted, looping hero background. Replace this file to change the wallpaper without changing code.

## GitHub initial push (PowerShell)
```powershell
git init
git add .
git commit -m "Initial Obsidian Universe website"
git branch -M main
git remote add origin https://github.com/ibrahim1101/Obsidian-Universe.git
git push -u origin main
```
For subsequent edits run `npm run dev` once, then the page hot-reloads when local files change.
