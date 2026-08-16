import { createComment, normalizeCommentFile, prependComment, validateCommentInput } from "../lib/comments-core.js";

const owner = process.env.COMMENTS_GITHUB_OWNER || "leiyang2003";
const repository = process.env.COMMENTS_GITHUB_REPO || "mbti_book";
const branch = process.env.COMMENTS_GITHUB_BRANCH || "comments";
const filePath = process.env.COMMENTS_GITHUB_PATH || "data/comments.json";
const token = process.env.COMMENTS_GITHUB_TOKEN;
const recentRequests = new Map();

function githubHeaders(authenticated = false) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "mbti-book-guestbook",
    "x-github-api-version": "2022-11-28",
  };
  if (authenticated && token) headers.authorization = `Bearer ${token}`;
  return headers;
}

function contentUrl() {
  return `https://api.github.com/repos/${owner}/${repository}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
}

function decodeFile(content) {
  return normalizeCommentFile(JSON.parse(Buffer.from(content, "base64").toString("utf8")));
}

async function readFile(authenticated = false) {
  const response = await fetch(contentUrl(), { headers: githubHeaders(authenticated) });
  if (!response.ok) throw new Error(`comments_read_${response.status}`);
  const payload = await response.json();
  return { file: decodeFile(payload.content), sha: payload.sha };
}

async function writeFile(file, sha) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/contents/${filePath}`, {
    method: "PUT",
    headers: { ...githubHeaders(true), "content-type": "application/json" },
    body: JSON.stringify({
      message: "Add public guestbook comment",
      content: Buffer.from(`${JSON.stringify(file, null, 2)}\n`, "utf8").toString("base64"),
      sha,
      branch,
    }),
  });
  return response;
}

function parseBody(request) {
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");
  return request.body || {};
}

function clientKey(request) {
  return String(request.headers?.["x-forwarded-for"] || request.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

function json(response, status, payload) {
  response.status(status).json(payload);
}

export default async function handler(request, response) {
  response.setHeader("content-type", "application/json; charset=utf-8");

  if (request.method === "GET") {
    response.setHeader("cache-control", "public, max-age=0, s-maxage=15, stale-while-revalidate=30");
    try {
      const { file } = await readFile(Boolean(token));
      return json(response, 200, { comments: file.comments, storage: `${branch}:${filePath}` });
    } catch {
      return json(response, 503, { error: "comments_unavailable", comments: [] });
    }
  }

  if (request.method !== "POST") {
    response.setHeader("allow", "GET, POST");
    return json(response, 405, { error: "method_not_allowed" });
  }

  response.setHeader("cache-control", "no-store");
  if (!token) return json(response, 503, { error: "comments_write_not_configured" });

  let input;
  try {
    input = parseBody(request);
  } catch {
    return json(response, 400, { error: "invalid_json" });
  }

  const validation = validateCommentInput(input);
  if (!validation.ok) return json(response, validation.status, { error: validation.error });

  const key = clientKey(request);
  const lastRequest = recentRequests.get(key) || 0;
  if (Date.now() - lastRequest < 20_000) return json(response, 429, { error: "rate_limited" });

  const comment = createComment(validation.value);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const { file, sha } = await readFile(true);
      const nextFile = prependComment(file, comment);
      const writeResponse = await writeFile(nextFile, sha);
      if (writeResponse.ok) {
        recentRequests.set(key, Date.now());
        return json(response, 201, { comment, comments: nextFile.comments, storage: `${branch}:${filePath}` });
      }
      if (![409, 422].includes(writeResponse.status)) throw new Error(`comments_write_${writeResponse.status}`);
    } catch (error) {
      if (attempt === 2) return json(response, 503, { error: "comments_save_failed" });
    }
  }

  return json(response, 503, { error: "comments_save_failed" });
}
