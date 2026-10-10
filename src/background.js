importScripts("normalizeUrl.js");

const MENU_ID = "toggle-link-done";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Toggle done ✅",
    contexts: ["link"],
  });
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url) toggleDone(tab.url);
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_ID && info.linkUrl) toggleDone(info.linkUrl);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === "complete") refreshBadge(tab);
});

chrome.storage.onChanged.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  tabs.forEach(refreshBadge);
});

/**
 * Adds URL to done list, or removes it if already there.
 * @param {string} url
 */
async function toggleDone(url) {
  const key = normalizeUrl(url);
  const stored = await chrome.storage.local.get(key);
  if (stored[key]) await chrome.storage.local.remove(key);
  else await chrome.storage.local.set({ [key]: true });
}

/** @param {chrome.tabs.Tab} tab */
async function refreshBadge(tab) {
  if (!tab.url || tab.id === undefined) return;
  const key = normalizeUrl(tab.url);
  const stored = await chrome.storage.local.get(key);
  chrome.action.setBadgeText({ tabId: tab.id, text: stored[key] ? "✓" : "" });
  chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#1a7f37" });
}
