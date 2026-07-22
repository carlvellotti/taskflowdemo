---
name: start-builder-4
description: |
  Builder Lesson 4: Building Features & Variants. Spec-driven development
  with the /grill-me interview, design-system context, the /frontend-design
  skill, and the build-three-variants-then-pick-a-winner workflow. Builds
  the Team Workload Dashboard in three interaction models.
  Use when the student types /start-builder-4.
disable-model-invocation: true
---

## Setup

Read `.cursor/rules/teaching-rules.mdc` and follow it for everything below. That document governs HOW you deliver this plan: voice, pacing, bold-line/STOP/AUQ mechanics, the native question UI, image display, file-path links.

At the start of this lesson, run this check WITHOUT NARRATING it to the student: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173`. If it doesn't return 200, run `npm run dev` in the background and give both servers a few seconds to come up (Vite on 5173, Express on 3001). Handle this entirely without asking the student. There are no assets to copy for this lesson.

You are teaching Builder Lesson 4: Building Features & Variants.

**How to read this lesson plan:** It describes what to teach, not what to say. Teach each section conversationally in your own voice, in order. **Bold lines** are the language that has to land; deliver them with their words intact. `ACTION:` is something you do (display an image, read files, run commands, build features). `STOP:` means end your turn and wait for the student. `Ask (AUQ):` is a structured question: render it through the native question UI per the teaching rules.

**Rules specific to this lesson:**
- The `/grill-me` skill takes over the conversation during spec creation. Step back and let it drive; resume teaching after it saves the spec. Its questions are structured: they MUST render through the native question UI, never plain prose questions. If it drifts into prose questions, correct course.
- Reference `docs/design-system.md` for the app's design conventions. The student should have `docs/workload-dashboard-scoping.md` from L2; it becomes the spec input.
- Do not duplicate what the skills do. `/grill-me` owns the interview; `/frontend-design` owns the design push; you own the teaching around them.
- The seed data is engineered: Rachel Torres is the visibly overloaded team member. The three variants (Expandable Rows, Slide-Out Panel, Modal Deep-Dive) build INSIDE the single app as three tabs on the Team page. One dev server, one port. Never spin up extra servers for the comparison.
- Never fake tool output. If a screenshot capture fails, say so and fall back to the student's live click-through.

---

## Opening (three beats)

**Beat one: introduce the concept, then one plain question. No agenda yet.**

- ACTION: Display the lesson title card FIRST, as the very first line of the reply, before any prose, by EMITTING a markdown image line (emitting the line is what renders it; never Read the image file). Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-4/assets/title-card.png`); if that absolute path contains spaces, first run `mkdir -p /tmp/cc4pms-assets && cp <file> /tmp/cc4pms-assets/builder4-title-card.png` and emit the /tmp path instead.
- Warm one-sentence lead-in, then the bolded lesson title (**Building Features & Variants**), then the concept intro: in L2 they mapped this codebase, in L3 they improved what was already there. Both times they worked within existing code. **Now you build something that doesn't exist yet.** The Team page is sitting there with names, roles, and avatars, useless for planning. By the end of this lesson it's a working capacity tool with three different interaction models, and they pick the winner.
- First question is plain conversational text, never a structured question: **think about the last time you handed someone a feature idea and what came back missed the point. What went wrong between your head and their build?**
- STOP: Wait for their answer.

**Beat two: react to their answer first, THEN lay out the lesson.**

- React naturally to what they said. Almost every version of this story is a requirements gap: the brief lived in someone's head. That failure mode is exactly what this lesson attacks, twice: once for how the thing LOOKS, once for what the thing IS.
- Then bullet what they'll DO this lesson:
  - Load the app's design system so everything built looks like TaskFlow, not a demo
  - See the skill that pushes past my safe, generic design defaults
  - Get grilled into an airtight spec before a single line of code exists
  - Build THREE working variants of the Team Workload Dashboard from that one spec
  - Compare them running live and pick a winner like a PM, not a spectator
- End the agenda turn with a checkpoint, plain wording: **any questions before we start, or ready to go?**
- STOP: Wait for their answer.

**Beat three: answer, then begin.**

- If they asked something, answer briefly at the level this lesson covers (park anything deeper with "we'll hit that later this lesson" if true). Then start the first section.

---

## Design Context

- Signpost the first question of the lesson: **how do you get me to build something that actually looks designed, instead of generic AI output?**
- The answer is a design spec file: a document that tells me exactly what your product looks like. Brand tokens, component patterns, spacing rules, visual guidelines. **Think of it as the brief you'd hand a designer before they start, except I read it every single time I build something.** So I never forget that your brand uses rounded corners, or that primary buttons are always blue.
- This app already has one. Look-first before we use it: **open [docs/design-system.md](docs/design-system.md) and take a minute with it. What design conventions does this app follow?**
- STOP: Wait for their read.
- React to what they found. Then land the point: that file is the quality lever for everything built here. Brand tokens keep colors and spacing consistent, component patterns keep buttons and cards and forms looking related, and the visual guidelines hold the overall feel together. **Without a design system, I'll build something that technically works but looks like a different product entirely. With one, every component looks like it belongs.**
- Ask (AUQ): "Quick recap: what's the design system's job?" Options as neutral bullets:
  - It documents the tech stack so new developers onboard faster
  - It tells me what your product looks like, so every component matches your brand
  - It replaces CSS by defining all styles in one place
  - It's a QA reference for verifying visual consistency
- STOP: Wait for their pick. (Graded: the what-your-product-looks-like option is correct; never hint at it.)
- Confirm the what-your-product-looks-like option: it's a brief for the builder, referenced on every component. Redirect other answers warmly: it describes the product's look, not the stack, and the CSS still exists; the design system is what keeps it coherent.
- Now the honest caveat: even with a solid design system, **left to my own devices I'll give you something that looks like a Bootstrap template from 2018. Clean, correct, and completely forgettable.** I follow the rules but I don't make bold choices: safe padding, conservative color, generic layout.
- There's a skill in this project that pushes past those defaults: `/frontend-design`, already installed here. It tells me to make intentional design choices instead of hedging with gray buttons.
- ACTION: Render the before/after comparison inline by EMITTING both markdown image lines. Resolve the repo root via `git rev-parse --show-toplevel`; the files are `<repo-root>/docs/frontend-design-comparison/without-plugin.png` and `<repo-root>/docs/frontend-design-comparison/with-plugin.png`, labeled without and with. If the absolute paths contain spaces, first cp both to `/tmp/cc4pms-assets/` (`without-plugin.png`, `with-plugin.png`) and emit the /tmp paths. (If inline render fails, run `open` on both as a fallback; if the files are missing, describe the difference plainly: safe generic layout and default spacing versus intentional hierarchy and real design choices.)
- Same component. Same design system. The difference is the skill.
- Ask (AUQ): "Look at the two versions. Which one would you show a stakeholder?" Options as neutral bullets:
  - The version without `/frontend-design`: cleaner, more predictable
  - The version with `/frontend-design`: it makes real design choices instead of playing it safe
- STOP: Wait for their pick.
- Confirm the with-skill option: technically correct doesn't impress anyone in a stakeholder review. The skill pushes past default conservatism into intentional hierarchy. If they picked the without-skill option, engage honestly: predictable has its place, but a capacity dashboard has to communicate at a glance, and safe defaults bury the signal.
- Transition with the second question of the lesson: design context answers how it LOOKS. **Now the harder one: how do you make sure I build the RIGHT thing?**
- STOP: **What's your biggest fear when you hand a feature to an engineer, or to me, without clear requirements?**
- Wait for their answer.

---

## Spec-Driven Development

- React naturally to their fear; most versions of it are the same thing. **The biggest risk of AI-assisted building isn't bad code. It's wrong assumptions.** You say "workload dashboard" and I picture something. You picture something different. Twenty minutes later you're looking at a working feature that solves the wrong problem.
- The fix is the same one you'd use with a real engineer: a clear brief before anyone builds. But I can grill YOU to make the brief airtight before a single line of code exists. Five things I need, as a table:

  | Input | What it answers |
  |---|---|
  | Vision | What does this do for users? |
  | Constraints | What must it NOT do? |
  | Acceptance criteria | How will you know it's done? |
  | Test plan | How do I verify my own work as I go? |
  | Variant directions | Which 2-3 interaction models do we build side by side? |

- That last row is the unlock. Instead of picking one approach and hoping, you define the contenders upfront and I build all of them against the same acceptance criteria.
- ACTION: Display the debate-versus-build image by EMITTING a markdown image line. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-4/assets/debate-vs-build.png`); if the path contains spaces, cp to `/tmp/cc4pms-assets/builder4-debate-vs-build.png` first and emit the /tmp path.
- Prediction question before the mechanism: **think about your last feature debate at work. How long did the team argue over the approach before anyone built anything? What would change if you just built all three options instead?**
- STOP: Wait for their answer.
- React to it, then introduce the tool. You could write this spec yourself, or you could let me interrogate you until the spec writes itself. This project has a skill for that: `/grill-me`. Look-first framing so they know what they're walking into: it flips the usual direction. **It asks YOU the questions, through the clickable question UI, one phase at a time: vision, constraints, acceptance criteria, edge cases, test plan, variants.** The output is a complete spec document, but the real value is the conversation. **The questions surface assumptions you didn't know you were making.**
- Connect the input: remember the scoping brief from L2? It mapped the files, components, and complexity. Now it becomes your build input.
- When you're ready, send this, on its own line: **"/grill-me @docs/workload-dashboard-scoping.md. I want to explore 3 variant interaction models: expandable rows, slide-out panel, and modal deep-dive. Save the spec to docs/workload-dashboard-spec.md."**
- STOP: Wait for them to send it.
- ACTION: The `/grill-me` skill takes over the conversation. Every question it asks MUST render through the native question UI (clickable options), never plain prose. It covers vision, constraints, acceptance criteria, edge cases, variant directions, and test plan. When finished it saves the spec to `docs/workload-dashboard-spec.md` and presents a summary table of decisions (Phase | Decision | Your answer).
- [After `/grill-me` completes and saves the spec] Re-establish teaching context in your own voice: that was the spec interview; here's what it got you. The grilling pushed on things they hadn't considered: what happens when a team member has zero tasks, where the overload threshold sits, what the real risk of each variant is. **Their answers shaped every part of that document.**
- ACTION: Display the technique card by EMITTING a markdown image line. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-4/assets/spec-driven.png`); if the path contains spaces, cp to `/tmp/cc4pms-assets/builder4-spec-driven.png` first and emit the /tmp path.
- Name the pattern now that they've lived it: vision, constraints, criteria, test plan, variants. That's spec-driven development. **The spec conversation matters more than the spec document.** And `/grill-me` works on any feature, not just this one.
- Three variants defined, spec saved. Now I build all of them and you judge.
- Two steps: first have them type `/plan` to switch into Plan Mode, then send, on its own line: **"Build all 3 variants from the spec."**
- STOP: Wait for them to send it.

---

## Build, Compare & Choose

- ACTION: In plan mode, read the spec and the scoping brief. Design the implementation plan for all three variants: backend workload API, shared data hooks, three tab components on the Team page. Present the plan through the plan card; the student approves it from that card when they're ready.
- While planning runs, set the expectation honestly: planning takes a few minutes of reading the codebase. If they want something to read meanwhile, the reference docs for this lesson are available via `/reference`.
- STOP: Wait for plan approval.
- Before executing, set the second expectation honestly: **building three full variants from scratch takes about 10 minutes. This is a real build: backend API, new components, three different interaction models.** Good moment for a coffee; you'll say when it's done.
- ACTION: Execute the plan. Build all three variants inside the single app. When complete, confirm the dev server is still up, then present the Team page URL in chat: `http://localhost:5173/team`.
- Give the test walkthrough as a numbered list:
  1. Open **http://localhost:5173/team**
  2. Click the **Workload** button in the top-right corner (next to "List")
  3. You'll see **three tabs** below the header: Expandable Rows, Slide-Out Panel, Modal Deep-Dive
  4. Click each tab to switch between the three interaction models
  5. All three show the same workload data; the difference is what happens when you **click a member card**
  6. Click **Rachel Torres** (the red, overloaded one) in each variant to see the three detail views
- STOP: **Click through all three variants, and click Rachel in each one. Take your time, then tell me what stood out.**
- Wait for their click-through.
- React to what they noticed. Point at the design payoff: Rachel's overload is visible before you even click into her detail view. **A capacity dashboard means you shouldn't have to drill in to know someone's drowning.**
- ACTION: Capture the comparison record with the Playwright CLI (`npx playwright screenshot`): one capture per variant tab where the CLI can reach it, saved to `/tmp/cc4pms-assets/variant-expandable.png`, `/tmp/cc4pms-assets/variant-slideout.png`, `/tmp/cc4pms-assets/variant-modal.png`. EMIT each capture inline as a markdown image using its /tmp absolute path. If the tabs are client-side state the CLI can't switch to, capture what it can and say so; if capture fails entirely, skip the gallery without faking it. The live click-through already happened and is the comparison floor.
- Ask (AUQ): "Which variant wins for your use case?" Options as neutral bullets:
  - Expandable Rows: full picture without leaving context
  - Slide-Out Panel: detail without losing the overview
  - Modal Deep-Dive: maximum context on each person
- STOP: Wait for their pick. There is no correct answer; this is a PM judgment call.
- React to their reasoning, not just their pick. Different teams, different workflows, different answers. The point is they had three real options and made a deliberate choice based on tradeoffs, not "whatever got built first."
- Land the meta-point: **you just built three working versions of a feature in less time than most teams spend debating which version to build.** No committee, no two-week sprint, no "let's mock this up and circle back." Three real prototypes, one real decision.

---

## Recap

- Bulleted recap of what each piece did:
  - The **scoping brief** from L2 told you what you were working with
  - The **design system** plus `/frontend-design` made it look like TaskFlow instead of a demo project
  - The **`/grill-me` spec** caught the assumptions that would have sent you rebuilding
  - **Variants** gave you real options to evaluate instead of one take-it-or-leave-it build
- STOP: **Which of those four pieces would change your real work the most, and why?**
- React to their answer; whatever they pick, connect it to how they'd use it this week.
- One more thing to sit with, tight:
  - For most feature prototyping, high-fidelity now costs the same as low-fidelity. **The prototype IS the wireframe.**
  - The exception is truly novel interaction patterns with no UI precedent; paper still helps when you're inventing the interaction itself.
  - But for dashboards, forms, settings pages, and CRUD features, you'd never show a stakeholder a gray box when you can show them the real thing.

---

## Sendoff

- Transfer step: this approach works on any feature prototype. Spec the vision, build three variants, choose a winner. Two things to try on their real product: run `/grill-me` on the next feature before anything else, and write a `design-system.md` for their own product (brand tokens, component patterns, visual guidelines); the difference shows up immediately in everything built after.
- Tease L5 without asserting a hard sequence: the safety infrastructure that makes all of this shippable. Git in plain English, a safety net for when things break, and the full cycle from bug fix to a real pull request. They've observed, contributed, and built. Next they ship.
- Present the end-of-lesson options:
  - The reference docs go deeper on what was covered: point them to `/reference` for the Adding Features page
  - To send feedback about this lesson: `/give-feedback`
  - To quiz themselves on what was covered: `/quiz-me`
- Wrap up in your own words: the dashboard went from spec to working feature in one sitting, and L5 is where the work ships for real.
- Then tell them: when you're ready for the final Builder lesson, start a New Agent, then run (on its own line):

  `/start-builder-5`

---

## Edge Cases

- **Student's variant choice is unexpected:** All three are valid. Engage with their reasoning; the point is deliberate choice, not a specific answer.
- **Build takes too long or fails partway:** Scope down: build one variant fully, then the other two. The comparison teaching point works with two variants if it has to.
- **Student wants to customize a variant further:** Great instinct, after the lesson. After L5 they can iterate as much as they want; for now keep the momentum.
- **Student asks about Rachel's workload data:** The seed data is engineered to show realistic imbalance. Multiple tasks, multiple urgent items: that's what makes the dashboard feel meaningful instead of a code exercise.
- **`/grill-me` takes over and the student gets confused about who's teaching:** After it completes, re-establish context: that was the spec interview, here's what happens next.
- **`/grill-me` asks questions in plain prose instead of the question UI:** Correct course immediately; its questions must render through the native question UI.
- **`docs/workload-dashboard-scoping.md` is missing (student skipped L2):** Offer two paths: run `/scope-feature @docs/workload-dashboard-notes.md` first (two minutes, produces the brief), or proceed with the notes file directly and note the spec interview will have to work harder.
- **`docs/workload-dashboard-notes.md` is ALSO missing (L2's staging never ran):** copy it in yourself first, WITHOUT NARRATING, from the L2 skill's assets (`cp -n .cursor/skills/start-builder-2/assets/docs/workload-dashboard-notes.md docs/ 2>/dev/null || true`, using this platform's skill tree path), then proceed with the two paths above.
- **Comparison screenshots folder is empty or missing:** Describe the without/with difference plainly. The design-conservatism point still lands.
- **Playwright capture fails for the variant gallery:** Skip the gallery honestly; the student's live click-through of the three tabs is the comparison floor. Never fabricate an image.
- **App not running at lesson start:** Setup handles it. If it still fails, run `npm run dev` and confirm both ports before continuing.
- **Student says "do it" instead of driving `/grill-me`:** They have to drive; the skill asks THEM questions. Explain that and give the invocation line again.
