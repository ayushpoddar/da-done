# Da Done

A Chrome extension to **mark web pages as done**. Links to those pages then get **highlighted on every site you visit**, so you know at a glance what you've already read or finished.

> ⚠️ **AI-generated:** this whole project (code, icons, docs) was generated using AI (Claude Code).

## Features
- **Toolbar button:** mark the current page done. Click again to undo.
- **Right-click any link → "Toggle done ✅":** mark a link without opening it.
- **Green highlight** on done links, with a "✓ Marked as done" pop-up on hover.
- **Green ✓ badge** on the toolbar icon when the page you're on is done.
- **Private:** your list stays in your browser. No account, no sync, no tracking.

## Install
1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick the repo folder.

## Same page or not?
These parts of a URL are ignored, so all of these count as one page:
- `http://` / `https://`
- `www.`
- `#anything`
- a trailing `/` or `?`

Example: `http://www.example.com/post/` = `https://example.com/post#comments`

Query params still count: `?v=1` and `?v=2` are different pages.

## Permissions
- **Read all sites:** to find and highlight links on pages you visit.
- **Tabs:** to show the badge for the current page.
- **Storage:** to save your done list (on this device only).
- **Context menus:** for the right-click option.

## Development
No build step, no dependencies.

```sh
node --test tests/*.test.js
```

## License
[MIT](LICENSE)
