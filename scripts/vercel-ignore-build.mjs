const commentsBranch = "comments";
const currentBranch = process.env.VERCEL_GIT_COMMIT_REF;
const shouldSkip = currentBranch === commentsBranch;

console.log(
  shouldSkip
    ? `Skipping deployment for the ${commentsBranch} data branch.`
    : `Continuing deployment for ${currentBranch || "the current branch"}.`,
);

process.exit(shouldSkip ? 0 : 1);
