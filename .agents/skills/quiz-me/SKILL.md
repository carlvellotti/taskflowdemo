---
name: quiz-me
description: |
  Quiz the student on what they just learned. Generates 3-5 questions based on
  the current lesson conversation. Use when the student types /quiz me.
---

Read `.fspm/progress.json` to know which lesson the student just completed.

Generate 3-4 quiz questions based on what was covered in the current conversation. Don't pull from the SKILL.md — use what the student actually experienced.

Mix three types of questions:
- **Conceptual:** Tests understanding of a key idea ("When should you use X vs Y?")
- **Applied:** Tests ability to use the concept in a scenario ("You have situation Z — what do you do?")
- **Classification:** Tests ability to categorize or sort ("Which of these belongs in A vs B?")

Ask one question at a time as a lettered menu, e.g.:

```
1. When should you reach for a sub-agent instead of just asking directly?

  (a) When the task is quick and needs no research
  (b) When the task would burn a lot of context and you don't need to watch it happen live
  (c) When you want the answer to show up instantly
  (d) Something else — tell me what you're thinking
```

Reply with just the letter. After each answer, react immediately before moving to the next question:
- If correct: brief confirmation, maybe add a nuance they might not have considered.
- If wrong: explain why the right answer is right — don't just say "incorrect."

Comprehension checks like these are graded — never mark an option "(Recommended)" or otherwise hint at the answer.

After all questions, give a quick summary: "You got X out of Y. [React naturally based on how they did.]"

Keep it light. This is a check-in, not an exam.
