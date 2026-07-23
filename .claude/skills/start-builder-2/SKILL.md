---
name: start-builder-2
description: |
  Builder Lesson 2: Exploring Codebases. A read-only technical intelligence
  package on the TaskFlow practice app: parallel sub-agent exploration into
  an architecture overview, an end-to-end flow trace with a sequence
  diagram, and a feature scoping brief. Use when the student types
  /start-builder-2.
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Task
  - AskUserQuestion
---

## Setup

Read `.claude/rules/teaching-rules.md` and follow it for everything below. That document governs HOW you deliver this plan: voice, pacing, bold-line/STOP/AUQ mechanics, and platform delivery.

At the start of this lesson, run this command WITHOUT NARRATING it to the student:

```bash
cp -rn .claude/skills/start-builder-2/assets/docs . 2>/dev/null || true
```

This stages `docs/workload-dashboard-notes.md` into the workspace `docs/` folder. The copy uses `-n`, so a re-run never clobbers files the student already has.

You are teaching Builder Lesson 2: Exploring Codebases.

**How to read this lesson plan:** It describes what to teach, not what to say. Teach each section conversationally in your own voice, in order. **Bold lines** are the language that has to land; deliver them with their words intact. `ACTION:` is something you do (display an image, read files, spawn sub-agents). `STOP:` means end your turn and wait for the student. `Ask (AUQ):` is a structured question: render it with the AskUserQuestion tool per the teaching rules.

**Rules specific to this lesson:**
- Do not copy, create, or deliver any files unless an ACTION line tells you to. Several beats depend on the STUDENT running a skill or sending a prompt first, so wait for them.
- The student runs `/explore-codebase` and `/scope-feature` during this lesson. Let those skills do their own work; do not duplicate their functionality.
- Every artifact saves to `docs/`. That folder becomes the student's context library for the rest of the module.
- Sub-agents run via the Task tool; parallel spawns return together as one batch. Structured questions always run here in the main conversation, never inside a sub-agent.
- This lesson runs INSIDE the taskflowdemo practice repo. The student arrived here from the course project via the Builder Bridge.

---

## Opening (three beats)

**Beat one: introduce the concept, then one plain question. No agenda yet.**

- ACTION: Display the lesson title card FIRST, as the very first line of the reply, by EMITTING this exact markdown image line (emitting the line is what renders it; never Read the image file): `![Exploring Codebases](.claude/skills/start-builder-2/assets/title-card.png)`
- Warm one-sentence lead-in, then the bolded lesson title (**Exploring Codebases**), then the concept intro: in L1 they clicked around TaskFlow the way a user would. They saw the bugs, the bare Team page, the unfinished pieces. That was the outside. Today they go inside: the actual files, the actual logic, the actual architecture.
- First question is plain conversational text, never a menu: **right now, when you need to understand how something actually works in your product, what do you do? Ask an engineer, dig through docs, poke at the UI?**
- STOP: Wait for their answer.

**Beat two: react to their answer first, THEN lay out the lesson.**

- React naturally to what they said. Whatever their current path is, it almost certainly means waiting on someone else or trusting documentation that went stale months ago. That waiting is what ends today.
- Then bullet what they'll DO this lesson:
  - Get oriented to how this codebase is laid out
  - Send three parallel agents to map the whole system into an architecture overview
  - Trace one user action end to end through the code, click to database and back
  - Scope what a brand-new feature would take, grounded in the actual code
  - All read-only: they will not write a single line of code, and every artifact saves to `docs/`
- End the agenda turn with a checkpoint, plain wording: **any questions before we start, or ready to go?**
- STOP: Wait for their answer.

**Beat three: answer, then begin.**

- If they asked something, answer briefly at the level this lesson covers (park anything deeper with "we'll hit that later this lesson" if true). Then start the first section.

---

## The Lay of the Land

- Signpost: before any agents run, get oriented to how this app is organized, because every codebase lays things out a little differently.
- Break with a prediction question before teaching the structure:
- STOP: **Take a guess first: what do you think the big pieces of a web app like this are? What would it split into?**
- Teach against their guess. Credit whatever they got right (most people land on "the part you see" and "the part with the data," which is most of it). Then give the real answer: three layers, the same shape as most web apps their engineering team works on:
  - The client layer holds the UI: components like buttons and forms, the pages you navigate to, shared hooks for data fetching, and style rules.
  - The server layer holds the API routes that handle requests and a SQLite database where everything is stored.
  - And a tests folder, sparse on purpose, with intentional gaps they'll notice later.
- Show the layout as a fenced text tree (never prose, never a figure):

  ```
  taskflowdemo/
  ├── client/          what users see
  │   ├── components/  buttons, forms, cards, modals
  │   ├── pages/       Dashboard, Projects, Tasks, Team, Settings
  │   ├── hooks/       shared logic (data fetching, state)
  │   └── styles/      CSS, design tokens, layout rules
  ├── server/          logic + data
  │   ├── routes/      API endpoints (what happens when the frontend asks for data)
  │   └── database/    SQLite, where everything is stored
  └── tests/           verification (sparse, intentional gaps)
  ```

- Quick recap check while the tree is on screen, one turn of its own:
- STOP: **Quick check: a customer says the New Task form looks broken. Which folder would you start looking in?**
- Confirm against the tree (client/, and components/ or pages/ both count; credit server/ reasoning if they suspect the data side). The point lands: the layout already tells them where work lives.
- Make it concrete with their week: a customer reports something weird with task creation. A VP asks "could we add a workload view?" A feature needs scoping for the roadmap. Every one of those used to mean asking an engineer and waiting. **By the end of this lesson you'll have three artifacts that answer those questions yourself: an architecture map, a flow trace, and a scoping brief.**
- Flow into the next section; the first artifact is the map.

---

## Map the System

- Frame what a newcomer needs: if they dropped into a new codebase tomorrow and had to get productive fast, they'd want three things:
  1. An architecture diagram showing how the pieces connect
  2. A tech stack summary of what they're working with
  3. A UI pattern catalog of what's already built and reusable (this one pays off directly in L4 when they build something new)
- The practice app ships a premade skill that generates all three. Look first: introduce [.claude/skills/explore-codebase/SKILL.md](.claude/skills/explore-codebase/SKILL.md) with one line (it fans out multiple agents across the codebase and synthesizes one overview document).
- STOP: **Open the skill file and read through it. What do you notice about how it splits up the work?**
- React to what they noticed. Then teach the why before anything runs: the skill spawns 3 sub-agents in parallel, and the point is isolation. **Each agent gets its own fresh context, so there's no cross-contamination between analyses.** If one agent read everything sequentially, the later analyses would be colored by the earlier ones. Think of it as sending three analysts to study the same building: one maps the structure, one inventories the materials, one catalogs the design patterns. Three independent perspectives, returned at once.
- Then, in this same turn, give the invocation framed as theirs to fire: when you're ready, run it, on its own line:

  `/explore-codebase`

- STOP: Wait for them to run it.
- ACTION: The skill runs the 3-agent pattern (architecture, tech stack, UI patterns) via the Task tool; the three run concurrently and return together. It synthesizes results into `docs/architecture-overview.md`. Then present the results as a bulleted summary, one bullet per agent:
  - **Architecture Mapper**: what it found about the system structure, layers, routing
  - **Tech Stack**: key libraries, frameworks, database
  - **UI Patterns**: reusable components, styling approach
- Point at the artifact: the whole thing is saved to [docs/architecture-overview.md](docs/architecture-overview.md) with a Mermaid architecture diagram, component tables, and a key-files reference. Be honest about where the diagram draws: the Mermaid block is diagram-as-text in the file; GitHub, Confluence, and most markdown viewers render it as a real picture, so it drops into a product doc or sprint planning as-is.
- STOP: **Any questions about what came back?**
- Answer what they ask, then check the concept:
- Ask (AUQ): "Three sub-agents explored this codebase in parallel. Why three separate agents instead of one long exploration?" Options (neutral, no letters; graded, so the correct option is never first):
  - One agent would run out of context window space
  - It's faster because they run simultaneously
  - Each agent gets fresh context, so there's no cross-contamination between analyses
  - An agent can only read a limited number of files
- STOP: Wait for their pick.
- If they picked the fresh-context option: confirm crisply. Speed is a nice side benefit, but the real reason is isolation: the architecture agent wasn't biased by what the UI patterns agent found. Otherwise: correct warmly with the isolation rationale.
- Turn the callback into a question rather than stating it:
- STOP: **Different lenses on the same thing, then synthesize at the end. Where have you seen that pattern before in this course?**
- Confirm: it's the builder-validator idea from Core, generalized. Independent perspectives beat one long pass, whether you're checking a brief or mapping a codebase.

---

## Trace a Flow

- Signpost the shift: the architecture overview says what's here. Now trace how one action actually works end to end, from the moment a user clicks a button to the moment the result appears on screen.
- Have the student drive in their own words:
- STOP: **Tell me to trace how a task gets created, end to end. Prompt it however you'd ask an engineer.**
- ACTION: Trace the create-task flow through the codebase. Generate a Mermaid sequence diagram and save it to `docs/task-creation-flow.md`. Present the flow as a numbered walkthrough: each step in the chain from button click to task appearing on screen. Keep it concrete: file names, what each layer does, what gets passed between them.
- Land the payoff line: **one button. Six files deep.** Now they know why engineers sigh at "can we just add a button?" A form component, a state hook, an API route, database logic, validation at multiple levels, and response handling back up the chain. Every layer has to work for that one click to do what the user expects.
- Point at the artifact and give it a look-first turn of its own:
- STOP: **Open [docs/task-creation-flow.md](docs/task-creation-flow.md) and walk the sequence diagram's steps. Does the chain match what you pictured when you clicked that button in L1?**
- React to their answer, then check the concept:
- Ask (AUQ): "A customer reports: 'I submitted the task form, the modal closed, but the task never showed up in the list.' You have the flow trace. Which gives engineering a better starting point?" Options (neutral; graded, correct never first):
  - "Task creation is broken"
  - "The submit worked (the modal closed) but the task doesn't appear, so the problem is probably in the refresh between the API response and the tasks hook"
  - "Something's wrong with the task form"
- STOP: Wait for their pick.
- If they picked the specific-diagnosis option: confirm and name the difference: the modal closing means the submit worked, so the symptom points downstream. They just went from filing a generic bug report to giving engineering a specific place to look. Otherwise: walk the symptom through the trace and show how it narrows the search.
- Bridge with the question every PM asks:
- STOP: **Two artifacts down. Now for the question you've asked engineering a hundred times: "how hard would it be to add this?" Except this time you answer it yourself. Ready?**

---

## Estimate the Work

- Open with their real process, plain question:
- STOP: **How do you figure out today whether a feature will be easy or hard to build? Gut feel? Ask an engineer? T-shirt sizes?**
- React naturally. Whatever their process, it has always run on incomplete information: you can't really assess difficulty without understanding the codebase. Now they have the architecture map and the flow trace. They know what's here.
- Look first at the input: in real work they'd come in with rough thinking already on paper. Introduce [docs/workload-dashboard-notes.md](docs/workload-dashboard-notes.md) with one line: rough, stream-of-consciousness notes on the Team Workload Dashboard, the kind of thing they'd jot down before talking to anyone. Not a PRD, and that's the point.
- Set the honest frame before the run: there's a skill called `/scope-feature` that takes notes like these and maps what building the feature would require: what already exists to reuse, what needs new infrastructure, where the hard parts are. **This doesn't produce an estimate to take to your engineering team and argue about. That's their call. It gives you an informed picture of where your leverage is.**
- Then, in this same turn: open the notes and skim them, and when you're ready, run this, on its own line:

  `/scope-feature @docs/workload-dashboard-notes.md`

- STOP: Wait for them to run it.
- ACTION: The skill reads the notes, the architecture overview, and the codebase, then saves the scoping brief to `docs/workload-dashboard-scoping.md`. Present a summary: what would need to be built, what already exists, where the difficulty is. Then highlight one or two specific insights, like which existing component makes part of the build straightforward, or which piece needs the most new work and why, connecting back to the architecture overview.
- Land the reframe: the brief is a map for their own thinking, not a contract with engineering. Walking into planning, they're not asking "how hard is this?" They're saying **"I see the workload calculation needs a new API endpoint and the triage system needs a new table. What am I missing?"** Engineers can engage with that.
- Ask (AUQ): "You walk into sprint planning with this scoping brief. What makes it more useful than your usual estimate?" Options (neutral; graded, correct never first):
  - It was generated by AI, so it's more accurate than human estimates
  - It references specific files and patterns instead of rough guesses
  - It includes a timeline engineers will agree with
  - It covers every edge case so nothing gets missed
- STOP: Wait for their pick.
- If they picked the specific-files option: confirm. The value is specificity: "this reuses the existing Stats grid and team hooks, but the workload calculation needs a new endpoint." Engineers can say "yes, that's right" or "you missed this dependency," and either way it's a better conversation. Otherwise: correct warmly; AI generation guarantees nothing, timelines are engineering's call, and no brief covers everything.
- Connect forward: in L4 they actually build this dashboard, and the scoping brief is the blueprint. They already know what patterns to reuse and where the gaps are.
- STOP: **Three artifacts, all saved to `docs/`. What's different now about how you'd walk into a scoping conversation with engineering?**

---

## Recap

- React to their reflection first. Then the bulleted recap of what they DID:
  - Mapped the whole system with three parallel agents into an architecture overview
  - Traced task creation end to end and saw why one click is six files deep
  - Scoped a brand-new feature against the actual code, not a rough guess
  - Wrote zero lines of code, and everything is saved in `docs/` for the rest of the module
- Land the bigger point: **you can now read the same system your engineers work in every day.** It doesn't make you an engineer, but it makes you the most informed PM in the room, and that changes every conversation about scope, bugs, and feasibility.
- STOP: **If you joined a new team tomorrow and wanted to get up to speed on their codebase fast, what's the first thing you'd generate?**
- React to their pick; any of the three artifacts is a good answer, and their reasoning is the interesting part.

---

## Sendoff

- Everything here transfers beyond the practice app:
  - Onboarding into a new team's codebase: run the parallel exploration and have the architecture overview before your first sprint
  - Evaluating a vendor's open-source project: map the architecture and trace a critical flow before committing
  - Roadmap planning: scope features against the actual code instead of rough guesses
  - And when the docs disagree with reality (they always do eventually), you can just look
- The concrete homework: **run `/explore-codebase` on a real repo you work with. The same skill works on any codebase.**
- Tease L3: they shift from observer to contributor. Targeted improvements to existing features, following the patterns this codebase already uses. The exploration they just did is exactly why L3 works: they already know what's here.
- Present the end-of-lesson options:
  - The reference docs go deeper on what was covered: point them to `/reference` for the Exploring Codebases playbook and the Sub-agents reference page
  - To send feedback about this lesson: `/give-feedback`
  - To quiz themselves on what was covered: `/quiz-me`
- Wrap up in your own words: the whole system is mapped and saved in `docs/`, and L3 is where they start changing the code they've been reading.
- ACTION: Before wrapping up, record this lesson as complete by running this WITHOUT NARRATING the raw output:

  `fspm progress complete builder-2`

  If it fails because the fspm CLI isn't installed, tell the learner progress tracking needs the FSPM CLI, offer to install it, and continue the wrap-up either way.
- Then tell them: when you're ready for the next lesson, run `/clear`, then run (on its own line):

  `/start-builder-3`

---

## Edge Cases

- **A sub-agent takes a long time or fails:** Acknowledge it and keep moving: "agents sometimes take a minute, let's look at what we got." If one fully fails, respawn it once; if it fails again, run that slice of the exploration yourself (read the key files, summarize) and say that's what you're doing. Never fake an agent's output.
- **Student wants to trace a different flow (not task creation):** Let them. The technique transfers to any flow; adjust the artifact name and references accordingly.
- **Student asks about files or patterns the practice app doesn't have:** Honest answer: this is a simplified app. A production codebase would add auth, caching, CI/CD, and more. The exploration pattern works the same way, there's just more to discover.
- **Student asks whether the Mermaid diagrams render here:** In this app the fence shows as diagram-as-text; the picture appears wherever the file lands in a Mermaid-aware viewer: GitHub, Confluence, and most markdown tools render it natively. The artifact is portable; nothing about the analysis depends on seeing the picture in-app.
- **Student wants to start changing things:** Hold them back gently. That energy is exactly what L3 is for; right now they're building the intelligence that makes those changes good.
- **Student hasn't done L1 (app never installed or run):** Help them set up first (`npm run install:all`, then `npm run dev`), confirm both servers are up, then continue. The exploration itself doesn't need the app running, but the workspace should be working.
- **`/scope-feature` runs long:** The skill should read from `docs/architecture-overview.md` rather than re-exploring the codebase. If it's still slow, generate the brief in the main conversation from the context already loaded and say that's what you did.
- **Student asks where these skills came from:** They ship with the practice repo, prestaged for this module. They can open any of them the same way they opened `/explore-codebase`, and after the course they can copy them into their own projects.
