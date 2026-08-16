import { randomUUID } from "node:crypto";

export const MAX_NAME_LENGTH = 40;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_STORED_COMMENTS = 300;

function cleanText(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function validateCommentInput(input) {
  const name = cleanText(input?.name);
  const message = cleanText(input?.message);
  const website = cleanText(input?.website);

  if (website) return { ok: false, status: 400, error: "invalid_submission" };
  if (!name || Array.from(name).length > MAX_NAME_LENGTH) return { ok: false, status: 400, error: "invalid_name" };
  if (!message || Array.from(message).length > MAX_MESSAGE_LENGTH) return { ok: false, status: 400, error: "invalid_message" };

  return { ok: true, value: { name, message } };
}

export function createComment(value, now = new Date()) {
  return {
    id: randomUUID(),
    name: value.name,
    message: value.message,
    createdAt: now.toISOString(),
  };
}

export function normalizeCommentFile(value) {
  const comments = Array.isArray(value?.comments) ? value.comments : [];
  return {
    version: 1,
    comments: comments
      .filter((comment) => comment && typeof comment.id === "string" && typeof comment.name === "string" && typeof comment.message === "string" && typeof comment.createdAt === "string")
      .slice(0, MAX_STORED_COMMENTS),
  };
}

export function prependComment(file, comment) {
  return {
    version: 1,
    comments: [comment, ...normalizeCommentFile(file).comments].slice(0, MAX_STORED_COMMENTS),
  };
}
