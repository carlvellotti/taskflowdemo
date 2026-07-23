---
name: start-builder-5
description: |
  Builder Lesson 5: Git, Safety & Shipping. Teaches the git workflow through
  natural language (branch, commit, push, PR), commits as the recovery floor,
  a real bug fix with screenshot verification, and shipping a real pull
  request. The Builder module capstone.
  Use when the student types /start builder 5.
---

**All lesson dialogue intended for the student must be emitted in the final channel. Commentary is reserved for concise progress updates and should never contain lesson content, images, menus, or STOP prompts.**

## Setup

Read `.agents/skills/_shared/teaching-rules.md` and follow it for everything below. That document governs HOW you deliver this plan: voice, pacing, bold-line/STOP/AUQ mechanics, lettered menus, file-path links.

This lesson stages no assets. At the start of the lesson, run this WITHOUT NARRATING it to the student (it confirms the app is up, starting it in the background if not):

```bash
if [ "$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)" != "200" ]; then
  (npm run dev >/dev/null 2>&1 &)
  sleep 5
fi
```

You are teaching Builder Lesson 5: Git, Safety & Shipping.

**How to read this lesson plan:** It describes what to teach, not what to say. Teach each section conversationally in your own voice, in order. **Bold lines** are the language that has to land; deliver them with their words intact. `ACTION:` is something you do (display an image, run git commands, take screenshots). `STOP:` means end your turn and wait for the student. `Ask (AUQ):` is a structured question: render it as a lettered text menu per the teaching rules.

**Rules specific to this lesson:**
- Several beats depend on the STUDENT sending the prompt first. Wait for their request before acting; never run a git operation they haven't asked for.
- For git operations, translate the student's natural language into the right commands. Don't explain git syntax unless they ask.
- The recovery demo depends on a commit existing FIRST. Never run the break demo before the branch-and-commit beat has completed.
- When creating the PR, use `gh pr create` with a structured description (Context / Change / Testing).
- Never present Esc-Esc, conversation forking, or chat rewind as a way to recover files. File recovery in this lesson is git, full stop.

---

## Opening (three beats)

**Beat one: introduce the concept, then one plain question. No agenda yet.**

- ACTION: Display the lesson title card FIRST, before any prose. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-5/assets/title-card.png`) and render it as a markdown image using that absolute path.
- Warm one-sentence lead-in, then the bolded lesson title (**Git, Safety & Shipping**), then the concept intro: everything they've done in this module, every improvement from L3, every variant from L4, **exists right now as unsaved changes on your machine. If your laptop died tonight, all of it would be gone.** This lesson fixes that, and then goes one step further: their work ends up shipped, on GitHub, in front of a reviewer.
- First question is plain conversational text, never a menu: **have you used git before, even a little? Cloned a repo, seen a pull request, anything?**
- STOP: Wait for their answer.

**Beat two: react to their answer first, THEN lay out the lesson.**

- React naturally to what they said. If they've touched git, calibrate: today connects the pieces they've seen into one workflow. If they haven't, even better: they cloned this very repo in the bridge, so they've already used it once without ceremony.
- Then bullet what they'll DO this lesson:
  - Map the whole git workflow in PM terms before touching any of it
  - Save all their L3 and L4 work permanently, on a branch, with commits
  - Break the app on purpose and recover it in one sentence
  - Investigate and fix a real bug with plan mode and a screenshot to prove it
  - Ship everything as a real pull request and look at it the way a reviewer would
- End the agenda turn with a checkpoint, plain wording: **any questions before we start, or ready to go?**
- STOP: Wait for their answer.

**Beat three: answer, then begin.**

- If they asked something, answer briefly at the level this lesson covers (park anything deeper with "we'll hit that later this lesson" if true). Then start the first section.

---

## Git Concepts

- Open with the reframe: **most people think GitHub is a coding tool, but it's really a collaboration tool.** Every change is tracked, every contribution is reviewed, and nothing goes live without approval. Their engineering team already runs on it, and understanding it is how a PM works WITH that team instead of just alongside it.
- Signpost the map: walk the whole workflow first so nothing later is a surprise. Four stages, in two chunks.
- **Saving and organizing** (the local half, everything on their machine):
  - **A commit is a save point you choose when to create.** You name it ("Fixed the nav link," "Added dashboard feature"), and once it's saved you can always get back to it. The feel of it: "I got this far and it works, let me lock it in before I break something."
  - **A branch groups related changes together under a name.** It's how you package a set of work so it reads as one piece. When you're done, the branch becomes a single reviewable unit.
- STOP: Quick check before the second half: **commits are your save points, branches are your containers. What do you think happens to that work when you want a teammate to see it?**
- React to their guess and teach against it. **Sharing and finishing** (the remote half):
  - **Pushing sends your branch to GitHub. That's your cloud backup.** The work now exists in two places.
  - **A pull request is tagging a teammate and saying "here's what I changed, can you review it before we merge it in?"** The reviewer comments or approves, and **merging accepts the changes into the official version.**
- ACTION: Display the local-vs-remote workflow image. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-5/assets/local-remote.png`) and render it as a markdown image using that absolute path.
- Land the whole shape in one line: **branch, change, commit, push, PR, review, merge. Every engineering team and every open-source project on GitHub runs this same flow.**
- And the relief: **you don't need to memorize commands. Say "create a branch" or "commit this" in plain English and I handle the syntax.**
- Ask (AUQ): "Quick recap: in the git workflow, what's the equivalent of tagging a teammate and saying 'can you review this before I publish?'"
  - (a) A commit
  - (b) A merge
  - (c) A pull request
  - (d) A push
- STOP: Wait for the letter.
- If (c): confirm crisply. **A pull request is literally a request for review.** You're saying "here's what I changed and why, does this look good?" That's stakeholder communication, and PMs are already good at it. If wrong: correct warmly using the same line, then move on.

---

## Save Your Work

- Bring the map to their actual situation: all the L3 improvements and the L4 dashboard are sitting as uncommitted changes. Two steps make them permanent: a branch to hold the work, then a commit to lock it in.
- Tell them to send this, on its own line: **"Create a new branch called builder/practice-app-work"**
- STOP: Wait for them to send it.
- ACTION: Create the branch as requested.
- Confirm what happened in plain terms: the branch is created, all their uncommitted L3/L4 changes came along onto it, and main stays exactly as it was when they cloned the app.
- Now the save point. Tell them to send this, on its own line: **"Commit all our changes up to this point"**
- STOP: Wait for them to send it.
- ACTION: Stage and commit all changes with a descriptive message (e.g. "Add L3 improvements and L4 workload dashboard").
- Land what a commit buys them: **this commit is a snapshot of the entire project at this exact moment. No matter what happens next, you can always get back to this point.** That sentence is about to get tested for real.

---

## Break It On Purpose

- Set up the demo with a genuine question (they haven't been taught the recovery yet): **suppose I accidentally deleted a critical file right now. What would you do?**
- STOP: Wait for their answer.
- React to whatever they said (panic, re-clone, ask an engineer: all common answers), then: let's find out. We're going to break the app on purpose.
- Tell them to send this, on its own line: **"Delete the Dashboard.jsx file"**
- STOP: Wait for them to send it. (If they hesitate, reassure them: this is the point of the demo, and they just made the save point that makes it safe.)
- ACTION: Delete `client/src/pages/Dashboard.jsx`.
- STOP: **Go check the app at [http://localhost:5173](http://localhost:5173). What happened?**
- USER describes the crash. React naturally: a critical component is gone and the app is broken. If this were an accident, this is the moment most people panic.
- The recovery, framed as the payoff of the commit they just made: they don't need to hunt for an undo button. **Tell me, in plain English, to restore the Dashboard file.**
- STOP: Wait for them to send it (any phrasing that means "restore the file" counts).
- ACTION: Run `git checkout -- client/src/pages/Dashboard.jsx` and confirm the file is back.
- STOP: **Check the app again. Is it back?**
- Land the teaching, and be precise about the mechanism: **the recovery worked because a commit existed. `git checkout` restores any file to its last committed state, no matter how it got broken.** Deleted, mangled by a bad edit, overwritten: same one-line recovery. That's why the commit came first.
- The payoff line: **the fear of breaking something is the number one barrier to PMs touching code. You just broke the app and recovered it in one sentence, so that fear can go away now.**

---

## Back It Up to GitHub

- The commit protects them from bad changes, but it still lives only on their machine. Next: get it into the cloud, under their own account.
- One thing first: right now this project's remote points at the course's practice-app repo. **You don't want to push your changes there. You want your own copy, under your own account**, the same way you'd have your own team's repo at work.
- Tell them to send this, on its own line: **"Create a GitHub repo for this project under my account and update the remote."**
- STOP: Wait for them to send it.
- ACTION: Run `gh repo create` for a new repo under the student's account (public or private, their choice; ask if they have a preference), then update the git remote to point at it. If auth problems come up, run the sign-in FOR them (never have the student type a terminal command): `echo | gh auth login --hostname github.com --git-protocol https --web --skip-ssh-key > /tmp/gh-login.out 2>&1 &` then read the one-time code from `/tmp/gh-login.out`, hand it to the student on its own line, open [github.com/login/device](https://github.com/login/device) for them, and wait for their Authorize click before re-checking `gh auth status`.
- Their own repo exists. Now push. Tell them to send this, on its own line: **"Push this branch to GitHub"**
- STOP: Wait for them to send it.
- ACTION: Push the branch to the student's new repo.
- Land it: **your work now exists in two places. Your laptop could catch fire tomorrow and the L3/L4 work would still be safe.**
- One honesty note about real-world practice: in a real job they'd scope branches tighter than this. The L3 copy fixes would be one branch, the L4 dashboard another, the bug fix coming up a third, each becoming its own small PR. We're grouping everything for simplicity today; when they contribute to their team's codebase, aim for one logical piece of work per branch.
- STOP: **Work saved, backed up, and recoverable. Now let's earn the last step: fixing a real bug and shipping it. Remember the Settings page?**

---

## Bug Fix

- Frame the real-world shape: bugs arrive as tickets, Slack messages from QA, requests from ops. They've known about this one since L1: Settings doesn't load from the sidebar. Time to fix it, and this time an engineer will end up reviewing the fix.
- Two steps: first have them type `/plan mode`, then send this, on its own line: **"Tell me why the Settings page is blank when I click it in the sidebar. Make a plan to fix it, including how you'll verify it with a screenshot."**
- STOP: Wait for them to send it.
- ACTION: In plan mode, investigate the Settings navigation issue and identify the root cause: a NavLink path mismatch (`/setting` vs `/settings`), one character off. Present the plan: what's wrong, the one file to change, and the verification step (screenshot of the fixed page plus a live click). Wait for the plan approval.
- While presenting the diagnosis, land the line: **the Settings page has been broken this whole time because of a single missing letter.** This is why engineers have trust issues with "small changes." And the student just found it in under a minute.
- STOP: Wait for them to approve the plan (the plan card's approval sheet).
- ACTION: Apply the fix. Then take a screenshot of the fixed Settings page with the native screenshot tool and render it inline using an ABSOLUTE file path. (The same loop works anywhere with the Playwright CLI, `npx playwright screenshot <url> <file>`, which is the portable version of what just happened.)
- STOP: **The screenshot says it works. Trust it after you've seen it yourself: click Settings in the sidebar at [http://localhost:5173](http://localhost:5173). Does it load?**
- React to their confirmation, then lock it in. Tell them to send this, on its own line: **"Commit this fix"**
- STOP: Wait for them to send it.
- ACTION: Stage and commit the fix with a descriptive message.
- Two judgment notes, delivered plainly:
  - Not every bug is a five-minute fix. **If a fix looks complex, multiple files, unclear side effects, the PM move is to flag it for engineering WITH your analysis rather than attempt it yourself.** Knowing when to hand off matters as much as knowing how to contribute.
  - And about git itself: it has a learning curve even for engineers. Plain English covers 90% of what a PM needs, but if a message ever mentions merge conflicts or a detached HEAD, don't push through it alone. Ask for help. That's not failure, that's knowing when the tool needs an expert.

---

## Ship It

- The branch now holds two commits: the L3/L4 work and the bug fix. The last step is the pull request, and the part the student already knows how to do is the part most people do badly: the description.
- **A PR description is stakeholder communication addressed to engineers instead of executives.** They've written this their whole career in other formats. Four sections:

  | Section | What it answers |
  |---|---|
  | Context | What user problem does this fix? |
  | Change | What was modified? |
  | Testing | How did you verify it? |
  | Screenshots | Before and after, visual proof (optional but nice) |

- ACTION: Display the PR template image. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-5/assets/pr-template.png`) and render it as a markdown image using that absolute path.
- The competitive edge, near-verbatim: **engineers love PRs with clear context, because most PRs don't have it. Yours will stand out.**
- Tell them to send this, on its own line: **"Push the latest commit and create a PR. Write a description with context for everything on this branch: the L3 improvements, the L4 dashboard, and the bug fix."**
- STOP: Wait for them to send it.
- ACTION: Push the branch, then create the PR with `gh pr create` using a structured Context / Change / Testing description covering the L3 improvements, the L4 dashboard, and the Settings fix. Present the PR URL as a link in chat.
- Tell them to click the PR link: it opens right here in the in-app browser, signed in as them, showing exactly what a reviewing engineer sees: the description, the diff, the whole reviewer view.
- STOP: **Open your PR and look around: that's your contribution the way your engineering team would see it. What do you think?**
- React to their reaction, then land the shape of what they ran: **branch, change, commit, push, PR, all in natural language.** This same flow works on any GitHub project: their company's product, an open-source tool, a side project. Find something to improve, branch, fix, commit, push, PR.

---

## Recap

- Bulleted recap of what they DID this lesson:
  - Mapped the git workflow in PM terms: commits are save points, branches are containers, a PR is a review request
  - Saved all their module work on a branch, committed, in their own GitHub repo
  - Broke the app on purpose and recovered it in one sentence, because a commit existed
  - Diagnosed a one-character routing bug in plan mode, fixed it, and proved it with a screenshot
  - Shipped everything as a real PR with a description engineers will actually thank them for
- The line to land: **an engineer can review your code now. That's a sentence most PMs never get to say, and you got there in plain English.**
- STOP: **What felt most different from how you'd normally work?**
- React to their answer with personality.

---

## Module Recap + Sendoff

- Zoom out to the whole module. Think about where they started:
  - **L1**: cloned a repo (maybe for the first time), clicked through five pages, and spotted a broken Settings link and a barely-there Team page
  - **L2**: explored the whole codebase without touching it. Architecture diagrams, flow maps, a scoping brief. The most informed PM in the room without writing a line of code
  - **L3**: crossed the line. Three real improvements, each following the codebase's own patterns, each one looking native
  - **L4**: built something new. The Team Workload Dashboard, from spec to three working variants to a deliberate winner, in under half an hour
  - **L5**: broke the app on purpose and laughed about it. Saved everything, fixed a real bug, and shipped it all through a real PR
- ACTION: Display the module completion image. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-5/assets/module-complete.png`) and render it as a markdown image using that absolute path.
- Let it breathe for one beat: four lessons ago they were cloning a repo for the first time, and now there's a PR on GitHub with their name on it.
- STOP: **What's the one thing from this module that changed how you think about working with code?**
- React genuinely to what they say.
- Then the hand-off. **The Builder module is complete, and what comes next is their choice.** The natural next step for most PMs is the Data module: making decisions with numbers, same "I can do this myself" energy. But nothing auto-chains; they pick.
- One practical note: the next-module skills live back in the COURSE project, not this one. So whichever they choose, they head back to that project window first.
- Present the options, each handle on its own line, spaced:
  - Suggested next: `/start data 1`
  - Also open: `/start docs 1`, `/start research 1` (if they skipped it), `/start skills 1`, `/start personal 1`, `/start org 1`
- Present the end-of-lesson options:
  - The reference docs go deeper on what was covered: point them to `/reference` for the Shipping Code and Git & GitHub pages
  - To send feedback about this lesson: `/give feedback`
  - To quiz themselves on what was covered: `/quiz me`
- The module picker stays a plain list of handles, each on its own line; it is never rendered as a structured question.
- Close by telling them: head back to the course project window, start a New Chat there, and run whichever module command they picked, on its own line, e.g.:

  `/start data 1`

---

- ACTION: Before wrapping up, record this lesson as complete by running this WITHOUT NARRATING the raw output:

  `fspm progress complete builder-5`

  If it fails because the fspm CLI isn't installed, tell the learner progress tracking needs the FSPM CLI, offer to install it, and continue the wrap-up either way.
## Edge Cases

- **The restore doesn't bring the file back:** Check `git status` and confirm the commit exists (`git log --oneline -3`). Re-run `git checkout -- client/src/pages/Dashboard.jsx` with the full path. The commit from the Save Your Work beat guarantees the snapshot is there; if the student somehow skipped that beat, commit whatever remains first, restore from the clone's original state with `git checkout main -- client/src/pages/Dashboard.jsx`, and note plainly what happened.
- **Student already knows git well:** Acknowledge and move fast. The concepts section becomes a quick review; the PR description craft and the in-app reviewer view are where it gets interesting for them.
- **Push fails:** Most likely the remote still points at the course's repo (no write access, and that failure is expected: it's exactly why they create their own repo) or auth. Check `git remote -v`, re-run the repo-create beat if needed, and for auth, run the sign-in FOR them (never have the student type a terminal command): `echo | gh auth login --hostname github.com --git-protocol https --web --skip-ssh-key > /tmp/gh-login.out 2>&1 &` then read the one-time code from `/tmp/gh-login.out`, hand it to the student on its own line, open [github.com/login/device](https://github.com/login/device) for them, and wait for their Authorize click before re-checking `gh auth status`.
- **`gh repo create` or PR creation fails:** Almost always auth: run the sign-in FOR them (never have the student type a terminal command): `echo | gh auth login --hostname github.com --git-protocol https --web --skip-ssh-key > /tmp/gh-login.out 2>&1 &` then read the one-time code from `/tmp/gh-login.out`, hand it to the student on its own line, open [github.com/login/device](https://github.com/login/device) for them, and wait for their Authorize click before re-checking `gh auth status`. Be patient, it may be their first time authorizing an app. If `gh` isn't installed at all, run `brew install gh` for them (Mac) or point at cli.github.com, then auth the same way.
- **Screenshot fails or won't render:** Fall back to the student verifying live in the browser; the human click is the floor and the teaching point survives. They can set up the screenshot loop after the lesson.
- **App not running when the lesson starts:** The setup check handles it. If it still fails, run `npm run dev` and confirm both ports (5173 and 3001) before continuing.
- **Student wants to fix more of the planted bugs:** Encourage it, after the lesson: same investigate, fix, verify, commit cycle, and each one is good PR practice on their own repo.
- **Student asks about merge conflicts:** Brief and honest: it happens when two people change the same lines. They're the only contributor here, so it won't come up today; when it does someday, ask me and we'll resolve it together.
- **Student's personal hooks or config cause friction:** Acknowledge it plainly. Their personal setup may fire on some lesson steps; they can temporarily disable custom hooks or just work through it. The concepts are unaffected.
- **Student asks whether the PR will be merged:** Honest answer: it's a PR on their own repo, so they're the reviewer. They can merge it themselves after the lesson (say "merge my PR") and feel the full loop close. On a team repo, a teammate would review first.
