const { test } = require("node:test");
const assert = require("node:assert/strict");
require("../src/normalizeUrl.js");

const cases = [
  ["https://example.com/post/1", "example.com/post/1"],
  ["http://example.com/post/1", "example.com/post/1"],
  ["https://www.example.com/post/1", "example.com/post/1"],
  ["https://example.com/post/1/", "example.com/post/1"],
  ["https://example.com/post/1?", "example.com/post/1"],
  ["https://example.com/post/1/?", "example.com/post/1"],
  ["https://example.com/post/1#comments", "example.com/post/1"],
  ["http://www.example.com/post/1/?#top", "example.com/post/1"],
  ["https://example.com/", "example.com"],
  ["https://example.com/watch?v=abc", "example.com/watch?v=abc"],
  ["https://example.com/watch?v=abc/", "example.com/watch?v=abc"],
  ["https://sub.example.com/a", "sub.example.com/a"],
];

for (const [input, expected] of cases) {
  test(`normalizeUrl(${input}) -> ${expected}`, () => {
    assert.equal(globalThis.normalizeUrl(input), expected);
  });
}
