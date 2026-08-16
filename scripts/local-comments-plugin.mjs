import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createComment, normalizeCommentFile, prependComment, validateCommentInput } from "../lib/comments-core.js";

function send(response, status, payload) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("body_too_large");
  }
  return JSON.parse(body || "{}");
}

export function localCommentsPlugin() {
  const localDirectory = path.resolve(".local");
  const localFile = path.join(localDirectory, "comments.json");

  async function load() {
    try {
      return normalizeCommentFile(JSON.parse(await readFile(localFile, "utf8")));
    } catch {
      return { version: 1, comments: [] };
    }
  }

  return {
    name: "local-comments-api",
    configureServer(server) {
      server.middlewares.use("/api/comments", async (request, response) => {
        if (request.method === "GET") return send(response, 200, { ...(await load()), storage: ".local/comments.json" });
        if (request.method !== "POST") return send(response, 405, { error: "method_not_allowed" });

        try {
          const validation = validateCommentInput(await readJson(request));
          if (!validation.ok) return send(response, validation.status, { error: validation.error });
          const comment = createComment(validation.value);
          const next = prependComment(await load(), comment);
          await mkdir(localDirectory, { recursive: true });
          await writeFile(localFile, `${JSON.stringify(next, null, 2)}\n`, "utf8");
          return send(response, 201, { comment, comments: next.comments, storage: ".local/comments.json" });
        } catch {
          return send(response, 400, { error: "invalid_json" });
        }
      });
    },
  };
}
