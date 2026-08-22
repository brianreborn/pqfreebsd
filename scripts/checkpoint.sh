#!/bin/sh
# Checkpoint a milestone: main module or freebsd-mac skill at top-level.
# Push to GitHub when origin exists. Does not create a repo (needs gh auth).
set -eu

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo /workspace)"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	echo "checkpoint: not a git repository" >&2
	exit 1
fi

msg=${1:-}
if [ -z "$msg" ]; then
	echo "usage: $0 \"milestone: <module-or-skill> — <what>\"" >&2
	exit 1
fi

git add -A
if git diff --cached --quiet && git diff --quiet; then
	echo "checkpoint: nothing to commit"
else
	git commit -m "$msg"
fi

if git remote get-url origin >/dev/null 2>&1; then
	branch=$(git rev-parse --abbrev-ref HEAD)
	git push -u origin "$branch"
	echo "checkpoint: pushed $(git rev-parse --short HEAD) → origin/$branch"
else
	echo "checkpoint: committed locally; no origin (set GH_TOKEN + git remote to push)"
fi
