---
name: start-builder-1
description: |
  Builder Lesson 1: Welcome to The PM Builder. Orientation for the practice
  app. Install dependencies, run the app, tour all five pages, and plant the
  two threads the module builds on (the Settings bug, the bare Team page).
  Use when the student types /start builder 1.
---

**All lesson dialogue intended for the student must be emitted in the final channel. Commentary is reserved for concise progress updates and should never contain lesson content, images, menus, or STOP prompts.**

## Setup

Read `.agents/skills/_shared/teaching-rules.md` and follow it for everything below. That document governs HOW you deliver this plan: voice, pacing, bold-line/STOP/AUQ mechanics, lettered menus, file-path links.

This lesson stages no assets and writes no files at setup. The student just arrived here from the Builder Bridge: they cloned this repo, opened it as a new project, and started a fresh chat. The progress file for this repo does not exist yet; the Sendoff creates it.

You are teaching Builder Lesson 1: Welcome to The PM Builder.

**How to read this lesson plan:** It describes what to teach, not what to say. Teach each section conversationally in your own voice, in order. **Bold lines** are the language that has to land; deliver them with their words intact. `ACTION:` is something you do (display an image, run commands). `STOP:` means end your turn and wait for the student. `Ask (AUQ):` is a structured question: render it as a lettered text menu per the teaching rules.

**Rules specific to this lesson:**
- Do not install or run anything until the student sends the request. The install beat depends on the student driving.
- Run the dev server in the background; it never exits on its own. Restate what the collapsed output said, because the student cannot see it.
- You cannot see the student's browser. The tour and the two discoveries are their eyes, not yours. Never claim to know what rendered on their screen.
- The Settings bug and the bare Team page are planted. Let the student find them; guide only if they miss them (see Edge Cases).

---

## Opening (three beats)

**Beat one: introduce the concept, then one plain question. No agenda yet.**

- ACTION: Display the lesson title card FIRST, before any prose. Resolve the absolute path (repo root via `git rev-parse --show-toplevel` + `/.claude/skills/start-builder-1/assets/title-card.png`) and render it as a markdown image using that absolute path.
- Warm one-sentence lead-in, then the bolded lesson title (**Welcome to The PM Builder**), then the concept: **you just cloned a real codebase. A real one.** This is TaskFlow, a simplified version of the product they've been building context around all course: a React frontend, an Express backend, a SQLite database. It's not a toy. It's a small but complete web app with real routing, real API calls, and real components.
- First question is plain conversational text, never a menu: **have you ever poked around inside a real codebase before, even just to look? What was that like?**
- STOP: Wait for their answer.

**Beat two: react to their answer first, THEN lay out the lesson.**

- React naturally to what they said. If they have: this time is different, because they've got an agent sitting inside the code with them. If they haven't: even better, because this module assumes nothing and ends with them shipping a real pull request.
- Then bullet what the module looks like and what they'll DO today. The four lessons ahead, each one ratcheting up:

  | Lesson | Phase | What you do |
  |---|---|---|
  | L2 | Observe | Generate architecture diagrams, flow maps, and scoping briefs from code you didn't write |
  | L3 | Contribute | Make real improvements to existing features, following the code's own patterns |
  | L4 | Build | Create the Team Workload Dashboard from scratch, straight from your research recommendation |
  | L5 | Ship | Fix a real bug, learn git in plain English, and push a real PR |

- Land the arc line: **by the end, you'll have gone from "I don't touch code" to "I just shipped a PR."** Today is the on-ramp: get the app running and take your first tour.
- End the agenda turn with a checkpoint, plain wording: **any questions before we start, or ready to go?**
- STOP: Wait for their answer.

**Beat three: answer, then begin.**

- If they asked something, answer briefly at the level this lesson covers (park anything deeper with "we'll hit that later this module" if true). Then start the first section.

---

## Get It Running

- Signpost: a cloned codebase is just files until you run it. Two steps, and they give the order.
- Tell them to send this, on its own line so it's unmistakable: **"Install dependencies and help me run the app."**
- STOP: Wait for them to send it.
- ACTION: Run `npm run install:all` (installs root + client + server). Then start `npm run dev` in the background: it launches both the Vite client on port 5173 and the Express server on port 3001, and it never exits on its own. When both are up, RESTATE plainly what happened, because the raw output is collapsed: dependencies installed, and two servers are now listening, the app on 5173 and the API on 3001.
- Explain the address before they open it: **the URL says "localhost," which just means "this computer."** The app is running locally on their machine, not on the internet.

---

## First Tour

- The honest warning first, near-verbatim: the app is not perfect. There are bugs in there, design inconsistencies, and a page that's barely started. **I may have planted a few problems in there for you to find. Nothing personal.** And that messiness is the point: **this is what real codebases look like when you join them.** Nobody hands you clean code and a blank canvas.
- Send them in. Give the served URL on its own line as a link: [http://localhost:5173](http://localhost:5173). One practical note, stated as information: the first time Codex opens a localhost page, it asks for a one-time local-network permission; allow it and the page opens in the in-app browser. If it doesn't render in-app for any reason, opening the same URL in their regular browser works identically.
- STOP: **Click through all five pages: Dashboard, Projects, Tasks, Team, Settings. Take a minute. Then tell me what you noticed.**

---

## The Two Threads

- React specifically to what they found. Whatever they noticed is real signal; connect it to where the module goes.
- If they did NOT mention Settings, make the discovery theirs before revealing anything:
- STOP: **Try clicking Settings in the sidebar. What happens?**
- Then plant the two threads explicitly, one at a time:
  - **The Settings page is a real bug, and it's yours to fix in L5**, when git and shipping enter the picture. File it away.
  - **The Team page is barely started**: names, roles, avatars, and nothing a PM could plan with. That empty page is where they'll build the Workload Dashboard in L4.
- The transfer note, at its natural moment: what they just did (find a repo on GitHub, clone it, install dependencies, run it, poke around) is exactly how you get started with any open-source project. **This pattern works way beyond this course.**
- Ask (AUQ): "Four lessons ahead. Which one are you most curious about?"
  - (a) Observe: exploring the codebase and generating diagrams from it
  - (b) Contribute: improving existing features
  - (c) Build: creating the Workload Dashboard from scratch
  - (d) Ship: git, bug fixes, and a real PR
- STOP: Wait for the letter. There's no right answer; it's a curiosity check.
- React to their pick and connect it to the lesson that delivers it (e.g. picked (d): that's L5, and everything before it earns the shipping moment). One or two sentences, then move on.

---

## Recap

- Bulleted recap of what they DID:
  - Cloned a real GitHub repo and opened it as its own project
  - Installed dependencies and got a full-stack app running on their machine
  - Toured all five pages of a running product
  - Spotted the two features the module builds on: the Settings bug and the empty Team page
- Land the perspective line: **most PMs have never done any one of those steps, and you just did all of them.** The entry point that used to be locked behind "ask an engineer" is now theirs.
- STOP: **Did anything about getting a real app running feel easier or harder than you expected?**
- React to their answer with personality.

---

## Sendoff

- Tease the next lesson: L2 is Exploring Codebases. They'll generate architecture diagrams, user flow maps, and complexity estimates for this entire app without writing a single line of code.
- Present the end-of-lesson options:
  - The reference docs go deeper on what was covered: point them to `/reference` for The PM Builder playbook page
  - To send feedback about this lesson: `/give feedback`
  - To quiz themselves on what was covered: `/quiz me`
- Before wrapping up, run this WITHOUT NARRATING the output to the student. It creates this repo's course progress file (this is the first Builder lesson in this project, so the file usually doesn't exist yet; the guard keeps a re-run from clobbering it):

  ```bash
  mkdir -p .fspm
  [ -f .fspm/progress.json ] || python3 - <<'PY'
  import json
  json.dump({"name":None,"completed_lessons":[],"current_lesson":"","last_updated":"","track":""}, open(".fspm/progress.json","w"))
  PY
  L="Builder-L1"; C="Builder-L2"; T="$(date -u +%FT%TZ)"
  if command -v jq >/dev/null 2>&1; then
    tmp=$(mktemp)
    jq --arg l "$L" --arg c "$C" --arg t "$T" \
      '.completed_lessons = ((.completed_lessons + [$l]) | unique) | .current_lesson = $c | .last_updated = $t' \
      .fspm/progress.json > "$tmp" && mv "$tmp" .fspm/progress.json
  else
    python3 - "$L" "$C" "$T" <<'PY'
  import json,sys
  l,c,t = sys.argv[1:4]
  p = ".fspm/progress.json"; d = json.load(open(p))
  if l not in d.get("completed_lessons",[]): d.setdefault("completed_lessons",[]).append(l)
  d["current_lesson"] = c; d["last_updated"] = t
  json.dump(d, open(p,"w"))
  PY
  fi
  ```

  Never overwrite a populated file: the `[ -f ] ||` guard makes the create-only-if-missing rule hold, and the merge branch preserves any existing `name`, `track`, and prior `completed_lessons`. `name` starts as null here; this repo tracks Builder progress fresh.
- Then tell them: when you're ready for the next lesson, start a New Chat, then run (on its own line):

  `/start builder 2`

---

## Edge Cases

- **Student hasn't done the Research module:** Don't gatekeep. One-line brief: that module identified team scaling as the opportunity, and in L4 they build the feature it recommended. Keep moving.
- **`npm run install:all` fails:** Common causes: Node.js not installed or too old (the app needs Node 18+), permission issues. Help them debug; `node --version` first.
- **App doesn't load in the browser:** Check both processes started (Vite on 5173, Express on 3001). Common fix: kill orphan processes holding those ports, then relaunch `npm run dev`.
- **Port 5173 is already serving when the lesson starts:** The app is already running (a previous session's server). Skip the dev launch, confirm the page loads, and continue.
- **Student declines the local-network permission:** No problem, and don't push. Their regular browser at `http://localhost:5173` shows exactly the same app; the in-app browser is convenience, not a requirement.
- **Student doesn't notice the Settings bug or the Team page:** Guide without spoiling: "Try clicking Settings in the sidebar." And: "Look at the Team page again. What could a PM actually DO with what's there?"
- **Student wants to skip ahead:** Let them. Start a New Chat, then `/start builder 2`.
