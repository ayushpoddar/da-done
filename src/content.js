const DONE_ATTRIBUTE = "data-da-done";
const DONE_LINK_SELECTOR = `a[${DONE_ATTRIBUTE}]`;
const TOOLTIP_GAP_PX = 6;
const MIN_SPACE_ABOVE_PX = 32;

/** @type {Set<string>} normalized URLs marked done */
let doneUrls = new Set();
let pendingScan = false;
const tooltip = createTooltip();

chrome.storage.local.get(null).then((stored) => {
  doneUrls = new Set(Object.keys(stored));
  scanLinks();
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener(async () => {
  doneUrls = new Set(Object.keys(await chrome.storage.local.get(null)));
  scanLinks();
});

document.addEventListener("mouseover", showTooltip);
document.addEventListener("mouseout", hideTooltipOnLeave);
window.addEventListener("scroll", () => (tooltip.hidden = true), { capture: true, passive: true });

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

/** @param {MouseEvent} event */
function showTooltip(event) {
  const link = event.target instanceof Element && event.target.closest(DONE_LINK_SELECTOR);
  if (!link) return;
  if (!tooltip.isConnected) document.documentElement.append(tooltip);
  const rect = link.getBoundingClientRect();
  const placeBelow = rect.top < MIN_SPACE_ABOVE_PX;
  tooltip.toggleAttribute("data-below", placeBelow);
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${placeBelow ? rect.bottom + TOOLTIP_GAP_PX : rect.top - TOOLTIP_GAP_PX}px`;
  tooltip.hidden = false;
}

/** @param {MouseEvent} event */
function hideTooltipOnLeave(event) {
  const link = event.target instanceof Element && event.target.closest(DONE_LINK_SELECTOR);
  if (!link) return;
  if (event.relatedTarget instanceof Node && link.contains(event.relatedTarget)) return;
  tooltip.hidden = true;
}

function createTooltip() {
  const element = document.createElement("div");
  element.id = "da-done-tooltip";
  element.textContent = "\u2713 Marked as done";
  element.hidden = true;
  return element;
}
