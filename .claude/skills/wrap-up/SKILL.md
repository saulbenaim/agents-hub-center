---
name: wrap-up
description: End-of-session close-out ritual. Commits and pushes the current work, opens or updates the PR, and CRUDs the linked Linear issue (state + handoff comment + follow-ups) so the session can be resumed on any computer.
argument-hint: "[project/repo or LIS-NN — optional; inferred from cwd/branch]"
allowed-tools: Bash, Read, Grep, Glob, mcp__claude_ai_Linear__get_issue, mcp__claude_ai_Linear__list_issues, mcp__claude_ai_Linear__save_issue, mcp__claude_ai_Linear__save_comment, mcp__claude_ai_Linear__list_comments, mcp__claude_ai_Linear__list_issue_statuses, mcp__claude_ai_Linear__get_project, Write
---

# Wrap Up Session

The end-of-session ritual. Put the work down cleanly so it can be picked up later from **any computer**, because the state lives in GitHub (the PR) and Linear (the ticket + handoff comment) — never on this laptop.

Pair skill: `/open` reads back everything this skill writes.

**Argument:** `$0` (optional) = project/repo name or a Linear issue id (`LIS-133`). If omitted, infer from the current directory and branch.

**Golden rules**

- Never push to a default branch (`main`/`master`). If on one, create a branch first.
- Don't fabricate. If a check fails, a step is skipped, or there's nothing to commit, say so plainly in the final report.
- Linear/GitHub mutations are real and outward-facing. Before creating **new** Linear issues or force-pushing, state what you're about to do.
- Keep going through every step even if one is N/A — report each as done / skipped / n/a.

---

## Step 0 — Resolve context

1. Determine the repo:
   - If `$0` looks like a Linear id (`^[A-Z]+-\d+$`), remember it as the explicit issue and detect the repo from cwd.
   - Else if `$0` is given, treat it as a repo/dir name and `cd` into it.
   - Else use the current directory. Run `git rev-parse --show-toplevel`. If cwd is **not** a git repo (e.g. the home dir), list candidate repos (`git -C <dir> rev-parse` over recently-used project dirs) and ask which one — do not guess.
2. Capture: `git branch --show-current`, the default branch (`git symbolic-ref refs/remotes/origin/HEAD` or fall back to `main`), and `git remote get-url origin`.
3. Resolve the **Linear issue**:
   - If an explicit id was given, use it.
   - Else parse the branch name for `([a-z]+)-(\d+)` → uppercase to `LIS-NN`. This matches the `<user>/lis-NN-…` convention.
   - Else search Linear: `list_issues` assignee="me", state In Progress, for the project that maps to this repo; if exactly one, use it; if several, list them and ask; if none, proceed without a linked issue (note it).

State the resolved context in one line before continuing: `repo · branch · LIS-NN (title)`.

## Step 1 — Survey the work

Run and read:

- `git status --short --branch`
- `git diff --stat` and `git diff --stat --staged`
- `git log --oneline @{u}.. 2>/dev/null` (unpushed commits, if upstream exists)

Write a 2–4 bullet summary of what actually changed this session (files/areas, intent). If the tree is clean and nothing is unpushed, skip Steps 2–4 and go to Step 5 (the work may already be committed; still update Linear).

## Step 2 — Quality gate (quick, report — don't block)

Detect and run the project's fast checks if they're defined and quick:

- Node: read `package.json` scripts — run `lint`, `typecheck`, `build`, or `test` if present and fast. Use the repo's package manager (pnpm/npm/yarn lockfile).
- Other stacks: the obvious equivalent if cheap.

Report pass/fail with the failing output summarized. **Do not** silently fix unrelated failures. If a check fails on code you touched, fix it; if it fails on unrelated/pre-existing code, note it and continue.

## Step 3 — Commit

1. If on the default branch, create a branch first: `git switch -c sbenaim/lis-NN-<slug>` (slug from the issue title). If there's no issue, use a short descriptive slug.
2. Stage intentionally: review `git status`; stage the session's work (`git add -A` is fine once you've confirmed the diff is all intended). Don't commit stray local junk.
3. Commit with a clear subject + short body explaining the why. End the message with:

   ```
   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
   ```

   Prefer a new commit over amending. If pre-commit hooks fail, fix the cause — don't bypass with `--no-verify`.

## Step 4 — Push & PR

1. `git push -u origin <branch>`.
2. Check for an existing PR: `gh pr view --json number,url,state,title 2>/dev/null`.
   - **None:** create one — `gh pr create`. Title = concise summary. Body must include: a **Summary** section, a **Test plan** section, and `Closes LIS-NN` (so the Linear↔GitHub integration auto-moves the ticket). End the body with the Claude Code attribution footer.
   - **Exists:** push updates the PR automatically. If the scope changed, update the body (`gh pr edit --body`).
3. Capture the PR URL for the report and the Linear comment.

## Step 5 — CRUD Linear (the handoff)

Using the resolved issue (skip gracefully with a note if none):

1. **State:** move the issue to the in-review state if a PR is open and not yet merged (`save_issue`). If the `Closes LIS-NN` integration already handles this, just verify. Don't move it to Done — merge does that.
2. **Handoff comment** (`save_comment`) — this is what `/open` reads next time. Structure it exactly:

   ```
   ## Session handoff — <YYYY-MM-DD>

   **Done this session**
   - …

   **In flight / not finished**
   - …

   **Next steps** (do these first next time)
   1. …

   **Open questions / decisions needed**
   - …

   **Risks / watch-outs**
   - …

   PR: <url>   ·   branch: <branch>
   ```

   Omit empty sections, but always include **Next steps**.
3. **Follow-ups:** for genuinely new work discovered this session (TODOs, bugs, deferred scope), create child/related Linear issues (`save_issue` with the project + a `**Why:**`/`**Scope:**` body, matching the existing Agents-Hub issue style). State how many you're about to create before creating them.

## Step 6 — Memory

If a durable, non-obvious fact emerged (a decision, a convention, a gotcha worth keeping across sessions), save it to memory per the memory rules. Skip if nothing qualifies.

## Step 7 — Report

Give a tight close-out:

- **Committed:** `<sha> <subject>` (or "nothing to commit")
- **Pushed:** branch → remote
- **PR:** `<url>` (created / updated)
- **Linear:** LIS-NN → `<state>`, handoff comment posted, N follow-ups created
- **Checks:** pass / fail (with detail)
- **Skipped / needs attention:** anything the human should know

End with one line: *"Run `/open` (optionally with this repo/issue) on any machine to resume."*
