---
name: open
description: Start-of-session orientation ritual. Pulls the repo, reviews open PRs and their CI/review state, reviews the linked Linear issue and its latest handoff, then synthesizes where you left off and what to do next. The counterpart to /wrap-up.
argument-hint: "[project/repo or LIS-NN — optional; inferred from cwd/branch]"
allowed-tools: Bash, Read, Grep, Glob, mcp__claude_ai_Linear__get_issue, mcp__claude_ai_Linear__list_issues, mcp__claude_ai_Linear__list_comments, mcp__claude_ai_Linear__get_project, mcp__claude_ai_Linear__list_projects
---

# Open Session

The start-of-session ritual. Get oriented fast and resume exactly where the last session (on any computer) left off. The state lives in GitHub (PRs) and Linear (tickets + handoff comments) — this skill reads it back and turns it into a plan.

Pair skill: `/wrap-up` writes everything this skill reads.

**Argument:** `$0` (optional) = project/repo name or a Linear issue id (`LIS-133`). If omitted, infer from the current directory and branch.

**Posture:** read-mostly. The only writes allowed without asking are `git fetch` and (after confirming a clean tree) `git checkout`/`git pull`. Never mutate Linear or push in this skill — that's `/wrap-up`'s job.

---

## Step 0 — Resolve context

1. Determine the repo (same logic as `/wrap-up`):
   - `$0` matching `^[A-Z]+-\d+$` → explicit Linear issue; detect repo from cwd.
   - `$0` as a repo/dir name → `cd` into it.
   - Else use cwd; if it's not a git repo, list candidate repos and recent "my" Linear issues, then ask which to open — don't guess.
2. Capture branch, default branch, and origin URL.
3. Resolve the Linear issue: explicit id → branch `([a-z]+)-(\d+)` → else the freshest In Progress / In Review issue assigned to me for this project. Note if none.

State the resolved context in one line before continuing.

## Step 1 — Git state

- `git fetch --all --prune`
- `git status --short --branch` — is the tree dirty? **If dirty, flag it loudly**: the last session may not have run `/wrap-up`. Summarize the uncommitted changes and ask whether to wrap up first, stash, or continue on top.
- `git log --oneline -8` and branch position vs upstream (ahead/behind).
- If clean and behind, offer to fast-forward (`git pull --ff-only`).

## Step 2 — PR review

- `gh pr list --author @me --state open --json number,title,headRefName,url,isDraft` for the repo — list what's open.
- For the PR on the current/linked branch (`gh pr view --json number,title,url,state,mergeable,reviewDecision,statusCheckRollup`):
  - **CI:** summarize `gh pr checks` — passing / failing / pending. Name the failing checks.
  - **Reviews:** any requested changes or comments? Summarize what's blocking merge.
  - **Mergeable:** conflicts? behind base?
- Surface anything that needs action *before* new work (red CI, requested changes, merge conflicts).

## Step 3 — Linear review

- Read the linked issue (`get_issue`): current state, description, and crucially the **latest `## Session handoff` comment** (`list_comments`, newest first) — this is the previous session's "next steps". Quote its Next-steps verbatim.
- Broader board context for the project (`list_issues` assignee="me"): what's In Progress / In Review / Todo, recent activity. Note anything newly assigned or recently changed by others.

## Step 4 — Synthesize

Produce a short, scannable orientation — this is the whole point of the skill:

```
## Resuming: <repo> · <branch> · LIS-NN <title>

Where you left off (from last handoff <date>)
- <the in-flight / next-steps summary>

State now
- PR:    <url> — CI <pass/fail>, review <state>, <mergeable?>
- Branch: <ahead/behind>, tree <clean/dirty>
- Linear: <state>

⚠ Needs attention
- <failing CI / requested changes / conflicts / open questions — or "none">

▶ Suggested next actions
1. <highest-leverage first, drawn from the handoff's Next steps + current state>
2. …
```

If the previous session ended mid-task with failing CI or an open question, that becomes action #1.

## Step 5 — Offer to resume

Ask how to proceed, with concrete options derived from the synthesis, e.g.:

- "Check out `<branch>` and start on next-step #1?"
- "Address the failing `<check>` first?"
- "Respond to the review feedback on the PR?"

Then proceed once the user confirms. Do not start editing code as part of `/open` itself.
