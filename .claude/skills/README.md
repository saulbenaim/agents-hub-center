# Session lifecycle skills

Source of truth for the cross-computer session rituals. See **LIS-134**.

- **`/wrap-up`** — end-of-session close-out: commit, push, open/update the PR (`Closes LIS-NN`), then CRUD the linked Linear issue (move state, post a `## Session handoff` comment, file follow-ups).
- **`/open`** — start-of-session orientation: fetch, review open PRs (CI/reviews/mergeability), read the linked issue's latest handoff comment, and synthesize where you left off + next actions.

The two are a pair: the handoff comment `/wrap-up` writes is exactly what `/open` reads back. State lives in GitHub (PRs) + Linear (tickets), so any computer that can reach them resumes seamlessly.

## Installing on a machine

These are **cross-project** skills, so they must live at the **user level** — only `~/.claude/skills` loads in every repo. This repo is just the synced source of truth.

```sh
# from a fresh clone of agents-hub-center
cp -r .claude/skills/open  ~/.claude/skills/open
cp -r .claude/skills/wrap-up ~/.claude/skills/wrap-up
# or symlink so updates here flow through:
#   ln -s "$PWD/.claude/skills/open"   ~/.claude/skills/open
#   ln -s "$PWD/.claude/skills/wrap-up" ~/.claude/skills/wrap-up
```

Then `/open` and `/wrap-up` are available in any project. Edit the canonical copies here and re-sync (or rely on the symlink).
