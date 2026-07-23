# HribShade

A self-contained web app: USGS Topo base map + client-side terrain (slope/aspect)
shading, built to work with offline

## Why this isn't a single .html file

Opening an HTML file directly on your phone (`file://...`) cannot register a
Service Worker or use the Cache Storage API — Android/Chrome only allows those
for pages served over `http://` or `https://` (this is a browser security rule,
not something this app can work around). So this is a small folder of files
that needs to be *served*, not just opened. Two easy ways to do that:

### Option A — Free hosting (recommended, easiest long-term)
1. Create a free GitHub account if you don't have one, make a new repository,
   and upload all the files in this folder (`index.html`, `sw.js`,
   `manifest.json`, `maplibre-gl.js`, `maplibre-gl.css`, the two icon PNGs).
2. Enable **GitHub Pages** for the repo (Settings → Pages → deploy from main
   branch). You'll get a URL like `https://yourname.github.io/hribshade/`.
3. Open that URL in Chrome on your Android phone.
4. Tap **"Install app to home screen"** when it appears (or Chrome menu →
   *Add to Home screen*). This installs it as a standalone offline-capable app.

Netlify Drop (netlify.com/drop) works the same way if you'd rather drag-and-drop
the folder without a GitHub account.

### Option B — Serve it locally from your phone (no internet upload needed)
1. Install **Termux** from F-Droid (not the outdated Play Store version).
2. Copy this folder onto your phone, e.g. into `Download/hribshade`.
3. In Termux: `pkg install python`, then
   `cd /sdcard/Download/hribshade && python -m http.server 8080`
4. In Chrome, go to `http://localhost:8080`. `localhost` is treated as secure,
   so the Service Worker will register normally.
5. Keep Termux running in the background when you want to use the map — it's
   just serving local files, so this needs no data connection at all.

## Using it before you lose signal

1. With Wi-Fi/data on, open the app and let the base map load.
2. In the **Offline Area** panel (top right), the bounding box is pre-filled
   to cover the full Granite Falls ↔ Darrington loop with a buffer. Adjust it
   or tap "Use current map view" if you only want a smaller stretch.
3. Zoom range 10–14 is a good default (covers Chrome's terrain shading and
   readable street-level topo). Tap **Estimate size** first — higher max zoom
   grows the download fast, especially over a ~50-mile corridor.
4. Tap **Download for offline use** and leave it running on Wi-Fi. It's fine
   to leave the app while it downloads.
5. Before you go, turn on Airplane Mode and reload the app to confirm the map
   and terrain shading both still work.

## About the terrain shading layer

It reads Mapzen/AWS "terrarium" elevation tiles (public, ~30m resolution,
SRTM-derived) and computes slope/aspect per-pixel in the browser (Horn's
method), colored by one of three presets: **Avalanche Terrain** (classic
25–59°+ slope-angle bands), **Aspect** (16-point compass coloring), or **Flat
ground**. This is the same math as the original `HribSoil.html` file's
"Terrain Shading" tab, trimmed down to just that feature.

⚠️ 30m elevation data smooths out small terrain features (cliff bands, gullies).
Treat the slope shading as a planning aid, not a substitute for on-the-ground
judgment or a dedicated avalanche-terrain analysis for backcountry travel.

## Files
- `index.html` — the app (map + terrain shading + offline downloader UI)
- `sw.js` — service worker, cache-first for tiles and app files
- `manifest.json` — lets Android install it as a standalone app
- `maplibre-gl.js` / `maplibre-gl.css` — the map library, bundled locally
  (no CDN dependency, so it also works offline)
- `icon-192.png` / `icon-512.png` — home screen icons
