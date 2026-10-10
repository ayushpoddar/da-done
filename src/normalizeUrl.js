/**
 * Strips hash, protocol, leading "www.", trailing "/" and "?".
 * @param {string} url
 * @returns {string}
 */
globalThis.normalizeUrl = (url) =>
  url
    .split("#")[0]
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[/?]+$/, "");
