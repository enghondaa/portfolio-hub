import type { TopicContent } from '@/types';

export const gitContent: TopicContent[] = [
  {
    id: 'core-concepts',
    moduleId: 'git',
    title: 'Core Concepts & Staging',
    description: 'How Git tracks changes — working tree, index (staging area), and commits',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'The Three Trees',
        content: `Git manages three "trees" (file snapshots):

**1. Working Tree** — your actual files on disk. Where you edit code.

**2. Index (Staging Area)** — a draft of your next commit. You explicitly add files here with \`git add\`.

**3. HEAD / Repository** — the last commit on your current branch.

\`\`\`
Working Tree  →  git add  →  Index  →  git commit  →  HEAD
\`\`\`

**Why the staging area?** It lets you craft commits precisely — you can stage only the lines relevant to one fix, leave the rest for a separate commit.`,
      },
      {
        title: 'Essential Daily Commands',
        content: `**Checking state:**
- \`git status\` — show what's changed (untracked, modified, staged)
- \`git diff\` — unstaged changes (working tree vs index)
- \`git diff --staged\` — staged changes (index vs HEAD)
- \`git log --oneline --graph\` — compact commit history with branch graph

**Staging:**
- \`git add <file>\` — stage a file
- \`git add -p\` — interactively stage hunks (pick specific lines)
- \`git add .\` — stage everything in current directory

**Committing:**
- \`git commit -m "message"\` — commit staged changes
- \`git commit --amend\` — rewrite the last commit (message or content)
- \`git commit --amend --no-edit\` — add staged changes to last commit without editing message

**Inspecting:**
- \`git show <commit>\` — show a specific commit's diff
- \`git log --author="name"\` — filter commits by author
- \`git blame <file>\` — show who last changed each line`,
      },
      {
        title: 'What is a Commit?',
        content: `A Git commit is a **snapshot**, not a diff. Git stores the full state of every tracked file at commit time, but uses content-addressable storage so identical files are only stored once.

Each commit contains:
- A SHA-1 hash (e.g. \`a3f2c1b\`)
- Pointer to parent commit(s)
- Author, committer, timestamp
- Commit message
- A tree object (full file snapshot)

**Commits are immutable.** \`git commit --amend\` creates a new commit with a different hash — it doesn't modify the old one. This is why amending published commits causes problems for others.`,
      },
    ],
    codeExamples: [
      {
        title: 'Staging specific lines with git add -p',
        language: 'bash',
        code: `# Stage only specific hunks (interactive)
git add -p src/components/Button.tsx

# Git will show each changed hunk and ask:
# Stage this hunk [y,n,q,a,d,s,?]?
# y = yes, n = no, s = split hunk further, ? = help

# Then commit only what you staged
git commit -m "fix: button accessible label"

# The rest of your changes remain unstaged for the next commit`,
        explanation: 'git add -p is one of the most powerful Git features for keeping commits clean and focused.',
      },
      {
        title: 'Fixing the last commit',
        language: 'bash',
        code: `# You just committed but forgot to include a file
git add forgotten-file.ts
git commit --amend --no-edit
# The file is now included in the last commit, same message

# Or fix the commit message
git commit --amend -m "feat: add user authentication"

# IMPORTANT: Only amend commits that haven't been pushed yet
# Amending a pushed commit requires force-push and disrupts teammates`,
        explanation: 'amend rewrites the last commit. Safe for local commits, dangerous for shared history.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between git add and git commit?',
        answer: `\`git add\` moves changes from the working tree into the **staging area (index)** — it's a way to say "include this in my next commit."

\`git commit\` takes everything currently in the staging area and saves it as a permanent snapshot in the repository history.

**Why two steps?** It lets you be deliberate. You might change 5 files but only want to commit 2 of them together (one logical change). \`git add\` lets you select exactly what goes into each commit.

\`\`\`bash
# Example: fix a bug AND add a feature in the same editing session
git add src/bugfix.ts          # only stage the bugfix
git commit -m "fix: null check"
git add src/feature.ts
git commit -m "feat: new filter"
# Clean, meaningful history — not one messy "fix stuff" commit
\`\`\``,
        difficulty: 'easy',
      },
      {
        question: 'What does git status show and how do you interpret it?',
        answer: `\`git status\` shows the state of your working tree and staging area relative to HEAD:

- **Untracked files** — new files Git doesn't know about yet (not in index or HEAD)
- **Changes not staged for commit** — files Git tracks that have been modified but NOT yet \`git add\`ed
- **Changes to be committed** — files that HAVE been staged (\`git add\`ed) and will go into the next commit

A file can appear in both "not staged" and "to be committed" if you staged it, then modified it again — you'd be committing the version you staged, not your latest edit.`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'branching-merging',
    moduleId: 'git',
    title: 'Branching & Merging',
    description: 'Creating branches, merging strategies, and resolving merge conflicts',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'Branches',
        content: `A branch is just a **lightweight pointer** to a commit. Creating one is instant and cheap — Git just creates a new file containing a commit SHA.

**HEAD** is a special pointer to the currently checked-out branch (or commit in detached HEAD mode).

\`\`\`bash
git branch feature/login      # create branch
git checkout feature/login    # switch to it
git checkout -b feature/login # create AND switch (shorthand)
git switch -c feature/login   # modern equivalent (Git 2.23+)
\`\`\`

**Naming conventions:**
- \`feature/user-auth\`
- \`fix/login-null-crash\`
- \`chore/upgrade-deps\`
- \`release/v2.1.0\``,
      },
      {
        title: 'Merge vs Rebase',
        content: `Both integrate changes from one branch into another, but they do it differently:

**Merge** creates a **merge commit** with two parents:
\`\`\`
main:    A - B - C -------- M
                  \\       /
feature:          D - E - F
\`\`\`
- Preserves full history exactly as it happened
- Merge commit shows where branches combined
- Can make history noisy with many branches

**Rebase** **replays** feature commits on top of main:
\`\`\`
main:    A - B - C
feature:          D' - E' - F'  (new commits, same changes)
\`\`\`
- Linear history — easier to read with \`git log\`
- Commits get new SHAs (rewrites history)
- **Never rebase shared/public branches** — it rewrites history that others have

**Fast-forward merge:** If the target branch has no new commits since the feature branched off, Git just moves the pointer forward (no merge commit created).`,
      },
      {
        title: 'Resolving Merge Conflicts',
        content: `Conflicts occur when two branches modify the same lines differently.

**Conflict markers in a file:**
\`\`\`
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 3000;
>>>>>>> feature/faster-timeout
\`\`\`
- **HEAD** = your current branch's version
- **feature/faster-timeout** = the incoming branch's version

**Steps to resolve:**
1. \`git status\` — see which files conflict
2. Open each conflicted file, decide which change to keep (or combine both)
3. Remove ALL conflict markers (\`<<<<\`, \`====\`, \`>>>>\`)
4. \`git add <resolved-file>\`
5. \`git commit\` — Git pre-fills the merge commit message

**Tools:** \`git mergetool\`, VS Code's built-in merge editor, or \`git checkout --ours <file>\` / \`git checkout --theirs <file>\` to take one side entirely.`,
      },
    ],
    codeExamples: [
      {
        title: 'Typical feature branch workflow',
        language: 'bash',
        code: `# Start from up-to-date main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-profile

# ... make changes, commit ...
git add src/UserProfile.tsx
git commit -m "feat: add user profile page"

# Keep up with main while working
git fetch origin
git rebase origin/main   # replay your commits on top of latest main

# When ready, push and open PR
git push origin feature/user-profile`,
        explanation: 'Rebase onto main before opening a PR ensures clean, conflict-free merge and linear history.',
      },
      {
        title: 'Merge strategies',
        language: 'bash',
        code: `# Merge (creates a merge commit)
git checkout main
git merge feature/user-profile

# Squash merge (all feature commits become ONE commit on main)
git merge --squash feature/user-profile
git commit -m "feat: user profile"   # write combined message

# Fast-forward only (fails if not fast-forwardable)
git merge --ff-only feature/quick-fix

# Delete branch after merging
git branch -d feature/user-profile        # local
git push origin --delete feature/user-profile  # remote`,
        explanation: 'Squash merging keeps main history clean — one commit per feature instead of every WIP commit.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between git merge and git rebase?',
        answer: `Both integrate changes from one branch into another:

**Merge** adds a new "merge commit" with two parents, preserving the exact history of when both branches diverged and rejoined. History is accurate but can become complex with many branches.

**Rebase** replays your branch's commits one by one on top of the target branch, creating new commits with new SHAs. The result is a linear history as if you'd branched off later — cleaner to read, but rewrites commit history.

**Rule of thumb:**
- Use \`rebase\` to update a local/feature branch with latest main (before a PR)
- Use \`merge\` to integrate a finished feature into main (or use squash merge)
- **Never rebase branches others are working on** — rewriting shared history forces everyone to reset their local copies

\`\`\`bash
# Update feature branch with latest main (local, safe to rebase)
git checkout feature/login
git rebase main

# Merge finished feature into main (preserves history or squash)
git checkout main
git merge --squash feature/login
\`\`\``,
        difficulty: 'medium',
      },
      {
        question: 'How do you resolve a merge conflict?',
        answer: `When Git can't automatically merge two branches (same lines changed differently), it pauses and marks the conflicts:

1. **Run \`git status\`** — see which files have conflicts (marked "both modified")
2. **Open each file** — find conflict markers:
   \`<<<<<<< HEAD\` (your version), \`=======\` (divider), \`>>>>>>> branch\` (incoming version)
3. **Edit the file** — keep the right content, delete all conflict markers
4. **\`git add <file>\`** — mark conflict as resolved
5. **\`git commit\`** — complete the merge (Git pre-fills the message)

**Tips:**
- Use VS Code's merge editor — it shows a visual 3-way diff
- \`git checkout --ours <file>\` keeps your version entirely
- \`git checkout --theirs <file>\` keeps the incoming version entirely
- \`git merge --abort\` cancels the entire merge if you want to start over`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'rebase-cherry-pick',
    moduleId: 'git',
    title: 'Rebase & Cherry-pick',
    description: 'Interactive rebase for clean history, and cherry-picking specific commits',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'Interactive Rebase',
        content: `\`git rebase -i\` lets you rewrite history interactively — reorder, edit, squash, or drop commits before sharing them.

\`\`\`bash
git rebase -i HEAD~3   # rewrite last 3 commits
git rebase -i main     # rewrite all commits since branching from main
\`\`\`

**Actions in the interactive editor:**
- \`pick\` — keep commit as-is
- \`reword\` — keep commit, edit message
- \`edit\` — pause to amend the commit content
- \`squash\` (s) — merge into previous commit, combine messages
- \`fixup\` (f) — merge into previous commit, discard this message
- \`drop\` (d) — delete the commit entirely
- \`reorder\` — just change the order of lines

**Common use:** Before opening a PR, squash your "WIP", "fix typo", "oops" commits into clean logical commits.`,
      },
      {
        title: 'Cherry-pick',
        content: `\`git cherry-pick <commit-sha>\` copies a specific commit from another branch and applies it to your current branch as a new commit.

**When to use:**
- A critical hotfix was made on a feature branch — you need it on \`main\` immediately
- You accidentally committed to the wrong branch
- Backporting a fix to an older release branch

\`\`\`bash
git cherry-pick a3f2c1b                # pick one commit
git cherry-pick a3f2c1b..e5d4f9a      # pick a range
git cherry-pick a3f2c1b --no-commit   # apply changes without committing
\`\`\`

**Caveat:** Cherry-picked commits have different SHAs. If the original branch is ever merged, Git may see the changes as duplicates (usually handles it fine, but can cause confusion).`,
      },
    ],
    codeExamples: [
      {
        title: 'Interactive rebase: clean up before a PR',
        language: 'bash',
        code: `# You have 5 messy commits:
# abc1234 WIP: started login
# def5678 fix typo
# ghi9012 WIP: more login work
# jkl3456 actually works now
# mno7890 oops forgot to add file

git rebase -i HEAD~5

# In the editor, change to:
# pick abc1234 WIP: started login
# fixup def5678 fix typo         <- merged into abc1234, no message
# squash ghi9012 WIP: more login <- merged, combined message
# reword jkl3456 actually works  <- keep but rename
# fixup mno7890 oops             <- merged silently

# Result: 2 clean commits instead of 5
# feat: implement login form
# feat: add form validation`,
        explanation: 'Interactive rebase is the tool for turning messy work-in-progress history into clean, reviewable commits.',
      },
      {
        title: 'Cherry-pick a hotfix to main',
        language: 'bash',
        code: `# A critical security fix was made on feature/auth
# but we need it on main NOW before the feature is ready

git log feature/auth --oneline
# 7a8b9c0 fix: patch XSS in user input sanitizer  <-- want this
# 3d4e5f6 feat: add OAuth flow
# 1a2b3c4 feat: login form

git checkout main
git cherry-pick 7a8b9c0

# The fix is now on main as a new commit
git log --oneline
# 9x0y1z2 fix: patch XSS in user input sanitizer
# ... (main's previous commits)`,
        explanation: 'Cherry-pick is the right tool when you need one specific commit without merging the entire branch.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is git rebase -i and when would you use it?',
        answer: `\`git rebase -i\` (interactive rebase) opens an editor where you can rewrite your branch's commit history before sharing it.

**Common operations:**
- **squash** — combine multiple "WIP" commits into one meaningful commit
- **reword** — fix a poorly written commit message
- **drop** — remove a commit entirely (e.g., debug logging you added)
- **reorder** — change the order commits appear

**When to use it:**
- Before opening a PR — clean up messy "work in progress" commits into logical, reviewable units
- When you want to split a large commit into smaller ones (\`edit\` action)
- When you need to remove a commit that introduced a secret/credential

**Important:** Only use interactive rebase on commits that **haven't been pushed** to a shared branch. Rewriting pushed history forces teammates to reset their local copies.`,
        difficulty: 'medium',
      },
      {
        question: 'When would you use git cherry-pick?',
        answer: `\`git cherry-pick <sha>\` copies a specific commit onto your current branch without merging the entire source branch.

**Real-world scenarios:**
1. **Hotfix backport** — a bug fix was made on \`main\`, you need it on \`release/v1.x\` too
2. **Wrong branch** — you committed to \`main\` accidentally; cherry-pick it onto your feature branch, then \`git reset HEAD~1\` on main
3. **Partial feature** — a feature branch has 10 commits but only 2 are ready; cherry-pick just those

**Downside:** Cherry-picked commits get new SHAs. When the original branch is eventually merged, Git will usually recognize the duplicate content, but it can create noise in history. Use sparingly — prefer regular merges/rebases when possible.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'stash-reset-revert',
    moduleId: 'git',
    title: 'Stash, Reset & Revert',
    description: 'Temporarily shelving work, undoing commits safely, and the difference between reset and revert',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'git stash',
        content: `\`git stash\` temporarily shelves changes so you can switch context without committing unfinished work.

\`\`\`bash
git stash              # stash everything (tracked modified files)
git stash -u           # also stash untracked files
git stash push -m "half-done login form"  # with a description

git stash list         # see all stashes
# stash@{0}: On feature/login: half-done login form
# stash@{1}: WIP on main: a3f2c1b add dashboard

git stash pop          # apply most recent stash and remove it
git stash apply stash@{1}  # apply specific stash (keep it in list)
git stash drop stash@{0}   # delete a stash
git stash clear        # delete ALL stashes
\`\`\`

**Common scenario:** You're mid-feature when an urgent bug is reported. Stash your work, fix the bug on a new branch, come back and pop your stash.`,
      },
      {
        title: 'git reset',
        content: `\`git reset\` moves the HEAD pointer (and optionally the index/working tree) backward to a previous commit.

**Three modes:**
\`\`\`bash
git reset --soft HEAD~1
# Moves HEAD back 1 commit
# Changes from that commit go back to STAGING (index)
# Working tree untouched — your code is safe, just unstaged

git reset --mixed HEAD~1   # (default)
# Moves HEAD back 1 commit
# Changes go back to WORKING TREE (unstaged)
# Index cleared — git add needed to re-stage

git reset --hard HEAD~1
# Moves HEAD back 1 commit
# Working tree and index are reset to match HEAD
# ⚠️ DESTRUCTIVE — your code changes are GONE
\`\`\`

**Use reset only on LOCAL (unpushed) commits.** Resetting pushed commits requires force-push and rewrites shared history.`,
      },
      {
        title: 'git revert',
        content: `\`git revert\` creates a **new commit** that undoes the changes from a specific commit. It does NOT rewrite history.

\`\`\`bash
git revert a3f2c1b        # creates a new "Revert" commit
git revert HEAD           # revert the last commit
git revert HEAD~3..HEAD   # revert last 3 commits
git revert a3f2c1b --no-commit  # stage the reversal without committing yet
\`\`\`

**Reset vs Revert:**
| | Reset | Revert |
|---|---|---|
| Rewrites history? | Yes | No |
| Safe for shared branches? | No | Yes |
| Creates new commit? | No | Yes |
| Use when | local cleanup | undoing pushed commits |

**Rule:** If the commit is already pushed/shared — always \`revert\`. If it's local only — \`reset\` is fine.`,
      },
    ],
    codeExamples: [
      {
        title: 'Stash workflow: interrupt and resume',
        language: 'bash',
        code: `# You're working on a feature
git status
# modified: src/feature/NewWidget.tsx

# Urgent bug report comes in — stash your work
git stash push -m "new widget half done"

# Switch to main and fix the bug
git checkout main
git checkout -b fix/urgent-null-crash
# ... fix the bug ...
git commit -m "fix: null check on user.profile"
git push origin fix/urgent-null-crash
# open PR, get merged

# Back to your feature
git checkout feature/new-widget
git stash pop
# Your changes are back, continue working`,
        explanation: 'Stash is perfect for context switching without polluting history with half-done commits.',
      },
      {
        title: 'Reset vs Revert in practice',
        language: 'bash',
        code: `# ---- RESET (local only) ----
# You committed too early, want to keep changes but recommit
git reset --soft HEAD~1
# Files are staged again — edit more, then recommit

# You want to completely undo your last commit AND discard changes
git reset --hard HEAD~1
# ⚠️ Your changes are gone. Only do this if you're sure.

# ---- REVERT (safe for shared branches) ----
# A bad commit slipped into main — need to undo it
git log --oneline
# d5e6f78 feat: add experimental widget (BAD!)
# a3b4c56 feat: user profile page

git revert d5e6f78
# Creates: "Revert feat: add experimental widget"
# History is preserved — no force-push needed
git push origin main  # safe, no history rewrite`,
        explanation: 'Use reset to rewrite local history; use revert to safely undo commits on shared branches.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between git reset and git revert?',
        answer: `**git reset** moves the branch pointer backward — it *removes* commits from history. The three modes control what happens to the changes:
- \`--soft\`: changes go back to staging
- \`--mixed\` (default): changes go back to working tree (unstaged)
- \`--hard\`: changes are **discarded entirely**

**git revert** creates a *new* commit that undoes the changes of a specific commit. History is preserved — the bad commit is still there, followed by a revert commit that cancels it out.

**When to use which:**
- \`reset\` — cleaning up **local, unpushed** commits (fixing mistakes before sharing)
- \`revert\` — undoing a commit that's already been **pushed/merged** into a shared branch

The golden rule: never use \`git reset\` on commits that others have already pulled — it rewrites history and causes conflicts for your team.`,
        difficulty: 'medium',
      },
      {
        question: 'How does git stash work and when would you use it?',
        answer: `\`git stash\` saves your current uncommitted changes (both staged and unstaged) onto a stack, then resets your working tree to match HEAD — giving you a clean working directory.

**Internally:** Git creates two commits (one for the index, one for the working tree) and stores them in \`refs/stash\`.

**When to use:**
- You're mid-feature when an urgent bug comes in — stash, fix the bug, pop your stash and continue
- You started work on the wrong branch — stash, checkout the right branch, pop
- You want to test something on a clean slate without committing

**Key commands:**
\`\`\`bash
git stash           # save current changes
git stash pop       # restore and remove latest stash
git stash list      # see all saved stashes
git stash apply stash@{2}  # restore specific stash (keep it)
git stash drop      # delete without applying
\`\`\`

**Note:** Stash doesn't save untracked files by default — use \`git stash -u\` to include them.`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'remotes-github',
    moduleId: 'git',
    title: 'Remotes, Pull Requests & GitHub',
    description: 'Working with remote repositories, pull vs fetch, forks, and the PR workflow',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'Remotes',
        content: `A **remote** is a reference to another copy of the repository (usually on GitHub/GitLab).

\`\`\`bash
git remote -v                    # list remotes
git remote add origin <url>      # add a remote named "origin"
git remote set-url origin <url>  # change remote URL

# origin = your fork or main repo
# upstream = original repo (when you've forked)
\`\`\`

**Tracking branches:** Remote-tracking branches like \`origin/main\` are local snapshots of what the remote looked like the last time you fetched. They don't auto-update — you need \`git fetch\` to refresh them.`,
      },
      {
        title: 'fetch vs pull vs push',
        content: `**\`git fetch\`** — downloads remote changes into your remote-tracking branches (\`origin/main\`) but does NOT change your local branch. Safe, non-destructive.

**\`git pull\`** — fetch + merge (or rebase with \`--rebase\` flag). Updates your local branch with remote changes.

\`\`\`bash
git pull origin main         # fetch + merge
git pull --rebase origin main  # fetch + rebase (cleaner history)
\`\`\`

**\`git push\`** — send your local commits to the remote.
\`\`\`bash
git push origin feature/login          # push branch
git push -u origin feature/login       # push and set upstream tracking
git push --force-with-lease            # safer force push (fails if remote has new commits you don't have)
\`\`\`

**Never \`git push --force\` on shared branches.** Use \`--force-with-lease\` as a safer alternative when you must force-push (e.g., after rebase).`,
      },
      {
        title: 'Pull Requests',
        content: `A **Pull Request (PR)** is a GitHub/GitLab feature to propose merging one branch into another. It's where code review happens.

**Good PR hygiene:**
- **Small and focused** — one feature or fix per PR (easier to review)
- **Clear title** — follows conventional commits: \`feat: add user auth\`
- **Description** — what changed, why, how to test
- **Self-review first** — read your own diff before asking others
- **Link to issue** — \`Closes #123\` auto-closes the issue on merge

**Review process:**
1. Author opens PR, assigns reviewers
2. Reviewers leave comments (line-level and general)
3. Author addresses feedback with new commits or replies
4. Approved → merged (merge commit, squash, or rebase merge)

**Draft PRs** — open a PR marked "Draft" to get early feedback before it's ready for formal review.`,
      },
    ],
    codeExamples: [
      {
        title: 'fetch vs pull comparison',
        language: 'bash',
        code: `# git fetch: safe inspection first
git fetch origin
git log origin/main --oneline   # see what changed remotely
git diff main origin/main       # compare your branch vs remote

# Now merge when ready
git merge origin/main

# git pull: fetch + merge in one step
git pull origin main

# Better: pull with rebase to avoid merge commits
git pull --rebase origin main

# Check what remote branches exist
git branch -r
# origin/main
# origin/feature/new-checkout
# origin/fix/payment-bug`,
        explanation: 'Prefer git fetch + inspect + merge over git pull blindly — especially on shared branches.',
      },
      {
        title: 'Force push safely after rebase',
        language: 'bash',
        code: `# You rebased your feature branch onto latest main
git checkout feature/user-profile
git rebase origin/main

# Now your local branch has diverged from remote
# (your commits have new SHAs after rebase)
# A regular push will be rejected

# WRONG: force push without safety net
git push --force  # ⚠️ danger — overwrites if teammate pushed

# RIGHT: force-with-lease checks remote hasn't changed
git push --force-with-lease
# Succeeds if remote matches what you last fetched
# Fails if someone else pushed to the branch since your last fetch`,
        explanation: '--force-with-lease is the safe way to force-push after a rebase. Always prefer it over --force.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between git fetch and git pull?',
        answer: `**\`git fetch\`** downloads commits, branches, and tags from the remote into your remote-tracking branches (e.g., \`origin/main\`) but does **not** modify your local working branch. You can inspect what changed before deciding to integrate.

**\`git pull\`** is shorthand for \`git fetch\` + \`git merge\` (or \`git rebase\` with \`--rebase\`). It updates both the remote-tracking branch AND your local branch in one step.

**Why prefer fetch:**
\`\`\`bash
git fetch origin
git log origin/main --oneline  # review what changed
git diff main origin/main      # see the diff
git merge origin/main          # integrate when ready
\`\`\`
This avoids surprise merge conflicts and lets you understand incoming changes first. On solo projects, \`git pull\` is fine. On team projects, \`git fetch\` + inspect is safer.`,
        difficulty: 'easy',
      },
      {
        question: 'What makes a good pull request?',
        answer: `A good PR is easy to review — which means the reviewer can understand the change quickly and give meaningful feedback.

**Key qualities:**
- **Small scope** — one feature, fix, or refactor. Not 50 files changed. If a task is large, break it into multiple PRs.
- **Clear title** — use conventional commits style: \`feat: add password reset flow\`
- **Useful description** — *what* changed, *why* it changed, *how to test* it, screenshots if UI changed
- **Self-reviewed** — author read their own diff and fixed obvious issues before requesting review
- **Tests included** — new behavior has tests, changed behavior has updated tests
- **No unrelated changes** — don't mix a feature with a code style cleanup
- **Linked to issue** — \`Closes #42\` in the description auto-closes the GitHub issue on merge

**Common anti-patterns:** PRs with 30+ files changed, vague titles like "fixes", no description, mixing unrelated changes, massive commits that should've been split.`,
        difficulty: 'easy',
      },
      {
        question: 'What is git push --force-with-lease and when would you use it?',
        answer: `\`--force-with-lease\` is a safer alternative to \`--force\` when pushing after a history rewrite (like rebase).

**The problem with \`--force\`:** It unconditionally overwrites the remote branch. If a teammate pushed a commit to your branch while you were rebasing, \`--force\` would silently delete their work.

**How \`--force-with-lease\` works:** It checks that the remote branch still matches the remote-tracking ref you last fetched (\`origin/feature-branch\`). If someone pushed new commits since your last fetch, the push is **rejected** — protecting their work.

\`\`\`bash
git rebase origin/main        # rewrite local history
git push --force-with-lease   # safe force push
# Error if teammate pushed since your last fetch
# Success if remote matches your last known state
\`\`\`

**Rule:** After any history rewrite (rebase, amend, interactive rebase), use \`--force-with-lease\` instead of \`--force\` on shared branches.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'workflows',
    moduleId: 'git',
    title: 'Team Workflows & Best Practices',
    description: 'Git Flow, trunk-based development, commit conventions, and .gitignore',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'Git Flow vs Trunk-Based Development',
        content: `**Git Flow** (traditional):
- Long-lived branches: \`main\`, \`develop\`, \`release/*\`, \`hotfix/*\`, \`feature/*\`
- Features merge into \`develop\`, then \`develop\` merges to \`main\` at release time
- Good for: scheduled releases, multiple versions in production
- Downside: complex, long-lived branches diverge significantly, big merges

**Trunk-Based Development** (modern, used by Google, Facebook):
- Everyone commits to \`main\` (trunk) frequently (at least daily)
- Feature branches are short-lived (hours to 1–2 days max)
- Use **feature flags** to ship incomplete features without exposing them
- Good for: CI/CD, continuous deployment, small focused PRs
- Downside: requires discipline, feature flags add complexity

**GitHub Flow** (simplified, popular for web):
- Single long-lived branch: \`main\`
- Feature branches + PRs → merge to \`main\` → deploy
- Simpler than Git Flow, works well for teams deploying continuously`,
      },
      {
        title: 'Conventional Commits',
        content: `A standard for commit messages that makes history readable and enables automation (changelog generation, semantic versioning).

**Format:** \`<type>(<scope>): <description>\`

**Types:**
- \`feat\` — new feature (triggers MINOR version bump)
- \`fix\` — bug fix (triggers PATCH version bump)
- \`docs\` — documentation changes
- \`style\` — formatting (not logic)
- \`refactor\` — code restructure (no feature/fix)
- \`test\` — adding/fixing tests
- \`chore\` — build tools, dependencies, CI

**Examples:**
\`\`\`
feat(auth): add password reset via email
fix(cart): prevent duplicate items on rapid click
docs(api): update authentication endpoints
refactor(user): extract useUserProfile hook
feat!: remove deprecated v1 API endpoints
\`\`\`

\`!\` after the type = **breaking change** (triggers MAJOR version bump in semver).`,
      },
      {
        title: '.gitignore Best Practices',
        content: `\`.gitignore\` tells Git which files to never track.

**Always ignore:**
- \`node_modules/\` — dependencies (recreated from package.json)
- \`.env\`, \`.env.local\` — secrets and environment variables
- \`dist/\`, \`build/\`, \`.next/\` — build artifacts
- \`.DS_Store\`, \`Thumbs.db\` — OS files
- \`*.log\` — log files
- IDE configs (\`.idea/\`, \`.vscode/\` — sometimes team-shared)

**Fix a file already tracked:**
\`\`\`bash
# Adding to .gitignore doesn't untrack already-committed files
git rm --cached .env         # untrack but keep file locally
git rm --cached -r dist/     # untrack directory
git commit -m "chore: stop tracking .env"
\`\`\`

**Global gitignore** — for OS/editor files, so you don't pollute project-level \`.gitignore\`:
\`\`\`bash
git config --global core.excludesfile ~/.gitignore_global
\`\`\``,
      },
    ],
    codeExamples: [
      {
        title: 'Conventional commit examples with scope',
        language: 'bash',
        code: `# Feature
git commit -m "feat(dashboard): add weekly summary chart"

# Bug fix with issue reference
git commit -m "fix(auth): resolve token expiry race condition

Closes #234
The token refresh was firing after the API call instead of before,
causing 401s on slow connections."

# Breaking change
git commit -m "feat!: upgrade to new API v2 response format

BREAKING CHANGE: response.data is now response.payload
Update all API consumers before deploying."

# Chore
git commit -m "chore(deps): upgrade React to 19.1.0"

# Revert
git revert a3f2c1b
# Git auto-generates: "Revert "feat(auth): add OAuth login""`,
        explanation: 'Conventional commits enable automated changelogs, semantic versioning, and make git log genuinely useful.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is trunk-based development and how does it differ from Git Flow?',
        answer: `**Git Flow** uses multiple long-lived branches (\`main\`, \`develop\`, \`release\`, \`hotfix\`, \`feature\`). Features are developed in isolation for days/weeks, then merged in a big batch. Good for scheduled releases but creates long-lived divergent branches and complex merges.

**Trunk-Based Development** has everyone commit directly to \`main\` (the trunk) very frequently — at least daily. Feature branches exist but are tiny (hours to 1–2 days). The key enabler is **feature flags** — code ships to production but is hidden behind a flag until ready.

**Benefits of trunk-based:**
- Reduces merge conflicts (smaller, more frequent integrations)
- Enables true CI/CD — main is always deployable
- Forces smaller, more reviewable changes
- Faster feedback loop

**Used by:** Google, Facebook, Netflix. Increasingly the default for teams doing continuous deployment. Git Flow is still common in products with versioned releases (mobile apps, packages).`,
        difficulty: 'medium',
      },
      {
        question: 'How do you undo a commit that has already been pushed to main?',
        answer: `**Use \`git revert\`** — never \`git reset\` on shared branches.

\`\`\`bash
# Find the commit to undo
git log --oneline
# d5e6f78 feat: add broken feature  <-- undo this

# Create a revert commit
git revert d5e6f78
# Opens editor for revert commit message (or -n to skip)

# Push normally — no force push needed
git push origin main
\`\`\`

\`git revert\` creates a **new commit** that applies the inverse of the bad commit. The original commit stays in history (useful for audit trail). Your teammates can \`git pull\` normally without any disruption.

**When to use \`git reset\` instead:** Only if the commit was JUST pushed and you're certain nobody has pulled it yet — then you can \`git reset --hard HEAD~1\` + \`git push --force-with-lease\`. But this is risky on shared branches and should be a last resort.`,
        difficulty: 'medium',
      },
    ],
  },
];
