const DONE_ATTRIBUTE = "data-da-done";

/** @type {Set<string>} normalized URLs marked done */
let doneUrls = new Set();
let pendingScan = false;

chrome.storage.local.get(null).then((stored) => {
  doneUrls = new Set(Object.keys(stored));
  scanLinks();
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener(async () => {
  doneUrls = new Set(Object.keys(await chrome.storage.local.get(null)));
  scanLinks();
});

function scheduleScan() {
  if (pendingScan) return;
  pendingScan = true;
  setTimeout(() => {
    pendingScan = false;
    scanLinks();
  }, 300);
}

// ponytail: rescans every link on each change; scan only added nodes if huge pages lag
function scanLinks() {
  for (const link of document.querySelectorAll("a[href]")) {
    link.toggleAttribute(DONE_ATTRIBUTE, doneUrls.has(normalizeUrl(link.href)));
  }
}
