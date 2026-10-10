# Da Done

Chrome extension (MV3). Mark URLs as done; links to done URLs get a ✅ on every page.

## Layout
- `manifest.json`: at repo root. Repo root = extension root ("Load unpacked" on it).
- `src/normalizeUrl.js`: URL cleaning. Used for both save and compare.
- `src/background.js`: toolbar button toggle, right-click link toggle, toolbar badge.
- `src/content.js` + `src/content.css`: tags done links with `data-da-done`. CSS adds ✅.
- `src/icons/`: PNG icons, 16/32/48/128.
- `tests/`: Node tests.

## Quirks and gotchas
- **Tests live in `tests/`, not `__tests__/`.** Chrome refuses to load an extension with any file/dir starting with `_`. This overrides the usual `__tests__` convention.
- **No build, no deps, no `package.json`.** Plain JS. Keep it that way.
- **Run tests:** `node --test tests/*.test.js`. Passing the dir (`node --test tests/`) fails on Node 22.
- **`normalizeUrl.js` is a classic script setting `globalThis.normalizeUrl`.** Loaded 3 ways: manifest `content_scripts.js` (must come before `content.js`), `importScripts` in the service worker (path relative to `src/`), `require` in tests. Don't make it an ES module without updating all 3.
- **Normalize rules:** drop `#...`, `http(s)://`, leading `www.`, trailing `/` and `?`. Query params are kept (`?v=abc` stays). Exact string match after that.
- **Storage:** `chrome.storage.local`, one key per normalized URL, value `true`. No array, so no read-modify-write races. No sync, by choice.
- **Badge** is per tab. Refreshed on tab URL change, page load complete, and any storage change.
- **Right-click menu** is one "Toggle done" item. It doesn't know a link's state, so it can't say "Mark" vs "Unmark".
- **Context menu is created in `onInstalled`.** After editing `background.js`, reload the extension in `chrome://extensions`. After content script edits, also reload open tabs.
- **`tabs` permission** is needed to read `tab.url` for the badge.
- **Link scan** rescans all `a[href]` on DOM changes (debounced 300ms). Ignores in-place `href` edits and iframes.
- **Icons:** ImageMagick's SVG renderer drops strokes (no checkmark). Generate with draw primitives:
  ```sh
  magick -size 512x512 xc:none -fill '#1a7f37' -draw 'roundrectangle 16,16 496,496 112,112' \
    -fill none -stroke white -strokewidth 64 -draw 'stroke-linecap round stroke-linejoin round polyline 136,264 224,352 384,168' /tmp/daDoneIcon.png
  for size in 16 32 48 128; do magick /tmp/daDoneIcon.png -resize ${size}x${size} src/icons/icon${size}.png; done
  ```
- **Manual testing only.** Claude-in-Chrome can't load unpacked extensions. Ask the user to load and try it.

## Out of scope (user said no)
Sync, export/import, management page, keyboard shortcut.
