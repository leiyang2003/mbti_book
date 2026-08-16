import assert from "node:assert/strict";
import test from "node:test";
import { createComment, normalizeCommentFile, prependComment, validateCommentInput } from "../lib/comments-core.js";

test("validates and normalizes public comment input", () => {
  assert.deepEqual(validateCommentInput({ name: "  小林  ", message: "  很受启发。\r\n谢谢。  " }), {
    ok: true,
    value: { name: "小林", message: "很受启发。\n谢谢。" },
  });
  assert.equal(validateCommentInput({ name: "", message: "hello" }).error, "invalid_name");
  assert.equal(validateCommentInput({ name: "reader", message: "" }).error, "invalid_message");
  assert.equal(validateCommentInput({ name: "reader", message: "hello", website: "bot" }).error, "invalid_submission");
});

test("prepends comments and keeps a stable file shape", () => {
  const comment = createComment({ name: "読者", message: "選択肢が増えました。" }, new Date("2026-08-17T00:00:00.000Z"));
  const next = prependComment(normalizeCommentFile({ comments: [] }), comment);
  assert.equal(next.version, 1);
  assert.equal(next.comments.length, 1);
  assert.equal(next.comments[0].createdAt, "2026-08-17T00:00:00.000Z");
});

test("Vercel handler reads and updates the fixed GitHub file", async () => {
  process.env.COMMENTS_GITHUB_TOKEN = "test-token";
  const originalFetch = globalThis.fetch;
  const requests = [];
  const initialFile = { version: 1, comments: [] };

  globalThis.fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    if ((options.method || "GET") === "PUT") return new Response(JSON.stringify({ content: { sha: "next" } }), { status: 200 });
    return new Response(JSON.stringify({
      sha: "current-sha",
      content: Buffer.from(JSON.stringify(initialFile), "utf8").toString("base64"),
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const { default: handler } = await import(`../api/comments.js?test=${Date.now()}`);
  const result = await invoke(handler, {
    method: "POST",
    body: { name: "Reader", message: "One more choice.", website: "" },
    headers: { "x-forwarded-for": "192.0.2.1" },
  });

  globalThis.fetch = originalFetch;
  assert.equal(result.statusCode, 201);
  assert.equal(result.payload.comments[0].name, "Reader");
  assert.equal(requests.length, 2);
  assert.equal(requests[1].options.method, "PUT");
  assert.match(requests[1].url, /data\/comments\.json$/);
});

function invoke(handler, request) {
  return new Promise((resolve, reject) => {
    const response = {
      headers: {},
      statusCode: 200,
      setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { resolve({ statusCode: this.statusCode, headers: this.headers, payload }); },
    };
    Promise.resolve(handler(request, response)).catch(reject);
  });
}
