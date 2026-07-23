---
name: start-builder-3
description: |
  Builder Lesson 3: Modifying & Improving. Teaches the reference pattern:
  finding how a codebase handles something before changing it. Three
  targeted improvements (copy fix, form polish, visual enhancement), plan
  mode throughout, and the agent self-verify screenshot loop.
  Use when the student types /start builder 3.
---

**All lesson dialogue intended for the student must be emitted in the final channel. Commentary is reserved for concise progress updates and should never contain lesson content, images, menus, or STOP prompts.**

## Setup

Read `.agents/skills/_shared/teaching-rules.md` and follow it for everything below. That document governs HOW you deliver this plan: voice, pacing, bold-line/STOP/AUQ mechanics, lettered menus, file-path links.

At the start of this lesson, run this check WITHOUT NARRATING it to the student: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173`. If it doesn't return 200, start the dev server in the background (`npm run dev`), wait a few seconds, and confirm both servers are listening (Vite on 5173, Express on 3001). The student should have a working `http://localhost:5173` before the lesson begins. Handle this entirely without asking them.

There is no asset deploy for this lesson.

You are teaching Builder Lesson 3: Modifying & Improving.

**How to read this lesson plan:** It describes what to teach, not what to say. Teach each section conversationally in your own voice, in order. **Bold lines** are the language that has to land; deliver them with their words intact. `ACTION:` is something you do (display an image, read files, edit files, take screenshots). `STOP:` means end your turn and wait for the student. `Ask (AUQ):` is a structured question: render it as a lettered text menu per the teaching rules.

**Rules specific to this lesson:**
- Every change in this lesson goes through plan mode: present the plan, wait for the student to approve it on the approval sheet, then execute. Never edit before approval.
- Verification always happens against the served app at `http://localhost:5173`, never against a file path.
- Reference `client/src/styles/tokens.css` for design tokens on any visual change.
- Use the built-in screenshot tool for the before/after loop in Improvement 3. If a screenshot fails, say so plainly and have the student verify in their browser instead. Never fake or describe a screenshot you didn't take.
- Do not edit any file unless an ACTION line (after plan approval) calls for it.

---

## Opening (three beats)

**Beat one: introduce the concept, then one plain question. No agenda yet.**

- ACTION: Display the lesson title card FIRST, before any prose. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-3/assets/title-card.png`) and render it as a markdown image using that absolute path.
- Warm one-sentence lead-in, then the bolded lesson title (**Modifying & Improving**), then the concept intro: in L2 they explored this codebase without touching anything. Diagrams, flow maps, scoping, all read-only. That was the observer phase. **Today you cross the line: you're going to change actual code in an actual app, and the changes will look like they belong.**
- First question is plain conversational text, never a menu: **have you ever asked an engineer for a "tiny" change and gotten a sigh back? What was the change?**
- STOP: Wait for their answer.

**Beat two: react to their answer first, THEN lay out the lesson.**

- React naturally to what they said. Most PMs have a story here; connect it forward, because by the end of this lesson they'll understand the sigh AND be able to make some of those changes themselves.
- Then bullet what they'll DO this lesson:
  - Learn the one habit that makes AI-assisted changes look native instead of bolted-on
  - Meet plan mode, the preflight check they'll use on every change
  - Make three real improvements: sharper copy, a polished form, better-looking dashboard cards
  - Give me a way to see my own work, so neither of us has to hope a change looks right
- End the agenda turn with a checkpoint, plain wording: **any questions before we start, or ready to go?**
- STOP: Wait for their answer.

**Beat three: answer, then begin.**

- If they asked something, answer briefly at the level this lesson covers (park anything deeper with "we'll hit that later this lesson" if true). Then start the first section.

---

## The Shift

- Set up the problem with a prediction question before naming the pattern: people complain that AI-generated code sticks out in a codebase, that you can spot it a mile away.
- STOP: **Why do you think that happens? What would make a code change look like an outsider dropped it in?**
- Teach against their guess. Credit whatever they said (style, formatting, and tone guesses are all partly right), then land the real mechanism with honesty about your own defaults: **left to my own devices, I get creative when I should be consistent.** I'll import a different icon library when the app already has one. I'll invent new naming conventions when there are perfectly good ones two files away. The code works, but it reads like a guest wrote it.
- The fix, and the habit that carries this whole lesson: **before you change anything, find how the codebase already handles that exact thing. Then match it.** If you want to improve a form, look at how other forms in this app work. If you want to add an icon, find where icons already live and how they're imported.
- ACTION: Display the shift image. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-3/assets/the-shift.png`) and render it as a markdown image using that absolute path.
- Contrast it with L2 in one beat: L2 was broad exploration, "map the whole system." That's right for understanding. For a specific change it's the wrong move; you want a targeted lookup of how THIS app handles THIS thing. **Consistency over creativity, always.**
- STOP: **Three improvements coming up: copy, forms, visuals. Each one starts with that same look-around-first move. Ready for the first one?**

---

## Plan Mode

- Signpost the tool before it's needed: before any change gets made, there's one tool to meet, because we'll use it on every change today. It's called **plan mode**.
- What it is, plainly: whenever you're not 100% sure what I'm about to do (which files I'll touch, what might break), you can have me plan instead of act. Switch the composer into plan mode by typing `/plan mode` (or pressing Shift+Tab) first, then send your request; just saying "enter plan mode" inside a message won't switch modes. **Instead of changing anything, I map out everything I'd do and show you the plan first.** A plan card appears, and nothing executes until you approve it on the "Implement this plan?" sheet.
- The judgment call, as a quick rule of thumb in a table:

  | Change | Plan mode? |
  |---|---|
  | One-line copy tweak | Probably skip it |
  | Anything touching multiple files | Yes |
  | Layout or logic changes | Yes |
  | Working with code in general | Almost always the right call |

- We'll use it for every change this lesson so the rhythm becomes automatic: scope, review, approve, execute.
- One practical note, delivered plainly: stay in this thread for the whole lesson. **Don't start a New Chat mid-lesson or you'll lose your place.** And the reference docs for this lesson are available via `/reference` any time.
- STOP: **What's a change you made recently (or asked for) where you'd have wanted a plan first?**
- React to their answer, then move into the first improvement.

---

## Improvement 1: Copy Fix

- Frame it: the first improvement is microcopy. Button labels, placeholder text, form labels. Small text that adds up to how finished the app feels.
- Tell them to prompt the scan, with the suggested request on its own line so it's unmistakable: **"Scan the app's forms and UI for microcopy that could be better."**
- STOP: Wait for them to send it.
- ACTION: Scan the app's forms and UI components (Read/Grep across `client/src/components/`). Present 3-5 specific microcopy suggestions as a table:

  | File | Current | Suggested |
  |---|---|---|

  For each suggestion, note how similar text is handled elsewhere in the app, so the existing conventions are visible.
- The PM judgment framing, kept intact: **not everything I suggest is worth changing.** Some of these are real improvements, some are fine as-is. Their call.
- Ask (AUQ): "Which are worth actually doing? Pick one or two." Render the suggestions as a lettered menu, one per letter, and ask them to reply with one or two letters (e.g. "a and c"). There's no right answer; this is product judgment.
- STOP: Wait for their picks.
- React to what they picked, engaging with their reasoning if they gave any. Then put plan mode to work. Two steps: first have them type `/plan mode` to switch the composer into plan mode, then send, on its own line: **"Scope the copy changes I picked. What files does this touch? What might break?"**
- STOP: Wait for them to send it.
- ACTION: In plan mode, present the plan: files affected and a risk read. For a copy fix this should be minimal, one or two files, no breaking risk. Wait for approval on the approval sheet.
- STOP: Wait for the student to approve the plan.
- ACTION: Apply the copy changes exactly as scoped.
- Have them verify with their own eyes: **open http://localhost:5173 and find your copy change. Did it land the way you expected?**
- STOP: Wait for their verdict.
- React, then land the why: the change reads native because we found how the app already words similar text and matched that style. Nobody browsing this code would flag it.
- Ask (AUQ): "You want to improve a form's placeholder text in some other app. What do you do FIRST?"
  - (a) Write better placeholder text based on UX best practices
  - (b) Find how other forms in that app handle placeholder text, and match that style
  - (c) Generate five creative options and pick the best one
- STOP: Wait for the letter.
- If (b): confirm crisply. If (a) or (c): correct warmly. Best practices and creativity are great in a vacuum; in an existing codebase, **consistency beats creativity**. Find the conventions first, then improve within them.
- STOP: **One down. The next one is structural, and it's where this pattern really earns its keep. Ready?**

---

## Improvement 2: Form Polish

- Frame the discovery before any code: every real codebase has inconsistency, because different people built different features in different sprints. One feature gets the full treatment, another ships bare. This app has a perfect example, and they're going to find it themselves.
- Look-first on the live app: **open http://localhost:5173, go to the Projects page and click "New Project." Then go to the Tasks page and click "New Task." Fill in a field or two on each. What differences do you notice between the two forms?**
- STOP: Wait for their observations.
- React to what they actually found (ProjectForm is bare next to TaskForm: thinner placeholders, rougher layout, less care). Then teach it: two forms, same app, two levels of polish. That gap is everywhere in real products, and users feel it even when they can't name it. **As a PM, these inconsistencies quietly erode trust in your product.**
- The move: not redesigning ProjectForm from scratch. **Find what TaskForm does well, and bring ProjectForm up to that standard.** Same reference pattern, pointed at your own codebase's best work.
- Two steps: first have them type `/plan mode`, then send, on its own line: **"Scope this: compare TaskForm and ProjectForm. What patterns does TaskForm use that ProjectForm is missing? Then improve ProjectForm to match that quality."**
- STOP: Wait for them to send it.
- ACTION: In plan mode, compare `client/src/components/tasks/TaskForm.jsx` and `client/src/components/projects/ProjectForm.jsx`. Identify the patterns TaskForm has that ProjectForm lacks (placeholder conventions, field layout, spacing, labels). Present the plan: which patterns get applied, which files change. Wait for approval.
- STOP: Wait for the student to approve the plan.
- ACTION: Apply the improvements as scoped. Report when complete, briefly.
- Verification, student-eyes again: **check both forms in the browser. Does New Project feel like it lives in the same app as New Task now?**
- STOP: Wait for their verdict.
- React. The best version of this improvement is invisible: it matches everything around it, same conventions, same quality bar.
- Ask (AUQ): "What's the biggest risk of skipping the reference pattern here and just improving ProjectForm from general best practices?"
  - (a) The form might look better in isolation but feel foreign next to the rest of the app
  - (b) TaskForm might accidentally break
  - (c) The change would take longer to build
- STOP: Wait for the letter.
- If (a): confirm. If not: correct warmly; the danger was never breakage or speed, it's a form that follows textbook guidelines while ignoring the app's own language.
- STOP: **Two down, one to go. The last one is visual, and it fixes a real limitation of mine. Ready?**

---

## Improvement 3: Visual Polish and the Self-Verify Loop

- Look-first on the live app: **go look at the stat cards at the top of the Dashboard. Do they feel finished, or could they use some work?**
- STOP: Wait for their read.
- React to their assessment. They're functional but flat: numbers in boxes, not much hierarchy or visual weight to help scanning. The data is fine; the presentation undersells it.
- Before fixing it, the honest limitation: so far THEY'VE done all the visual checking by switching to the browser. That works, but think about what it means on my side: **I literally cannot see what I build. Making visual changes without screenshots is like writing CSS blindfolded.** I edit the code and hope.
- Turn the fix into a callback question before revealing it: there's a pattern for this. You give the builder a way to check its own work, or a second set of eyes entirely. **You used it in Core and again in Research. What's it called?**
- STOP: Wait for their answer.
- Confirm or supply it: **builder-validator.** One agent (or one step) builds, a check verifies. Here the validator is a camera: Codex has a built-in screenshot tool, so I can screenshot the page before the change, make the change, screenshot after, and compare the result against what you asked for. Neither of us hopes anymore.
- ACTION: Display the loop image. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-3/assets/screenshot-loop.png`) and render it as a markdown image using that absolute path.
- One-line portability note: outside Codex, a CLI called Playwright does the same job (`npx playwright screenshot <url> <file>`), so this loop travels to any setup.
- Two steps: first have them type `/plan mode`, then send, on its own line: **"Improve the Dashboard stat cards with better spacing and visual weight. Reference the design tokens in tokens.css. Screenshot before and after so we can compare."**
- STOP: Wait for them to send it.
- ACTION: In plan mode, read `client/src/styles/tokens.css` for the app's design tokens (colors, spacing, font sizes). Scope the changes to `client/src/components/dashboard/Stats.jsx`: spacing, hierarchy, and visual weight from the tokens only. This app has no icon library, so do NOT add one (that would be exactly the guest-code move this lesson warns about); if visual accents help, minimal inline SVGs styled from the tokens are the honest ceiling. Present the plan. Wait for approval.
- STOP: Wait for the student to approve the plan.
- ACTION: Take the "before" screenshot of `http://localhost:5173` with the built-in screenshot tool and render it inline as a markdown image (absolute path). Then apply the improvements as scoped. Then take the "after" screenshot and render it inline the same way. If the screenshot tool fails at any point, say so plainly and fall back to student browser verification; never describe a screenshot that wasn't taken.
- Both images should now be in the conversation, before and after.
- STOP: **Compare them. Does the after match what you had in mind, or would you push it further?**
- STOP handling: engage with their verdict; if they'd push further, note one concrete next tweak they could ask for after the lesson.
- Close the beat: the screenshots mean the result is checked, not hoped for. And the improvements pulled their colors, spacing, and sizing from `tokens.css`, the app's own design tokens, so the cards still speak TaskFlow's visual language. Reference pattern again.
- Ask (AUQ): "Why reference tokens.css instead of just picking colors and spacing that look good?"
  - (a) tokens.css has objectively better colors than I'd pick
  - (b) The app's existing design tokens keep the change consistent with the rest of the product
  - (c) I can't generate CSS without a reference file
- STOP: Wait for the letter.
- If (b): confirm. If not: correct warmly. I can absolutely invent good-looking values, and that's the trap: better in isolation, inconsistent in context. **The tokens ARE the pattern.**

---

## Recap

- Bulleted recap of what they DID:
  - Learned the reference pattern: **find how the codebase already handles it, then match it**
  - Met plan mode and used it as the preflight check on every single change
  - Sharpened microcopy they chose with their own product judgment
  - Raised ProjectForm to TaskForm's quality bar
  - Polished the Dashboard stat cards with the app's own design tokens, verified by before/after screenshots
- The thread to reinforce: all three changes look native because every one started with a look around. **Consistency over creativity is the single most important habit for making AI-assisted changes that don't look AI-assisted.**
- STOP: **Of the three improvements, which one felt most like something you'd actually do at work next week?**
- React to their answer with personality.

---

## Sendoff

- Tease L4 without overselling: next lesson they go from improving existing code to building something that doesn't exist yet, the Team Workload Dashboard, straight from the Research module's recommendation. They'll write a build spec, use the prestaged `/frontend design` skill to escape generic AI defaults, generate three variant prototypes, and pick the winner. The reference pattern doesn't go away; it gets more powerful, because everything they build will lean on what's already here.
- Present the end-of-lesson options:
  - The reference docs go deeper on what was covered: point them to `/reference` for the Modifying & Improving and Plan Mode pages
  - To send feedback about this lesson: `/give feedback`
  - To quiz themselves on what was covered: `/quiz me`
- Wrap up in your own words: three real improvements are live in the app, and L4 moves them from improving features to building one from scratch.
- ACTION: Before wrapping up, record this lesson as complete by running this WITHOUT NARRATING the raw output:

  `fspm progress complete builder-3`

  If it fails because the fspm CLI isn't installed, tell the learner progress tracking needs the FSPM CLI, offer to install it, and continue the wrap-up either way.
- Then tell them: when you're ready for the next lesson, start a New Chat, then run (on its own line):

  `/start builder 4`

---

## Edge Cases

- **Screenshot tool fails or is unavailable:** Say so plainly and have the student verify in their browser instead. The teaching point (give the builder a way to check its own work) still lands; offer the Playwright CLI (`npx playwright install chromium`, then `npx playwright screenshot`) as the try-it-later path. Never simulate a screenshot.
- **App not running at lesson start:** Setup handles it automatically. If it still fails, debug with the student (`npm run dev`, check ports 5173 and 3001, kill orphan processes on those ports) before continuing.
- **All copy suggestions are good and the student can't pick:** Any choice works. The point is exercising judgment, not finding a right answer.
- **Student wants to fix everything, not just 1-2 copy items:** Let them do two now, and note the rest will still be there after the lesson. Keep momentum.
- **A change breaks something:** Lean into it as a teaching moment. Scope the rollback in plan mode, or restore the file directly with `git checkout -- <file>`. Breaking and recovering is exactly what L5's safety net covers in depth.
- **Student notices the "Completd Tasks" typo on the Dashboard:** Credit the catch. That's one of the planted bugs, and it's theirs to fix in L5 when git and shipping arrive.
- **Student asks whether plan mode costs them anything:** It costs about 30 seconds and saves the mystery. Plans are cheap; surprise edits aren't.
- **Student wants to skip plan mode on a change:** Fine for the copy fix if they insist (it's genuinely low-risk), but keep it for the form and visual changes; multi-file edits are exactly what it's for.
- **Plan mode didn't engage (no plan card, changes just happened):** They sent the request without toggling first. Have them type `/plan mode` to switch the composer, then resend the same request. One line, no drama.
- **Student starts a New Chat mid-lesson anyway:** They can rerun `/start builder 3`; the lesson is idempotent (no asset deploy, no lesson-state writes), so pick up from wherever their app state actually is.
- **Student asks why we don't just let them edit the code directly:** They can, and some students do. The lesson teaches the agent-driven path because it scales to changes they couldn't hand-write; editing directly is always allowed.
