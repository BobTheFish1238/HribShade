# HribShade

A self-contained web app: USGS Topo base map + client-side terrain (slope/aspect)
shading, built to work with offline

## Bookmark or save this page

https://bobthefish1238.github.io/HribShade/

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
