---
name: quiz-me
description: |
  Quiz the student on what they just learned. Generates 3-5 questions based on
  the current lesson conversation. Use when the student types /quiz-me.
---

Read `.fspm/progress.json` to know which lesson the student just completed.

Generate 3-4 quiz questions based on what was covered in the current conversation. Don't pull from the SKILL.md. Use what the student actually experienced.

Mix three types of questions:
- **Conceptual:** Tests understanding of a key idea ("When should you use X vs Y?")
- **Applied:** Tests ability to use the concept in a scenario ("You have situation Z, what do you do?")
- **Classification:** Tests ability to categorize or sort ("Which of these belongs in A vs B?")

Ask one question at a time with the AskUserQuestion tool (follow `.claude/rules/auq-padding.md` for spacing): a short question stem plus up to four answer options as neutral choices. The tool provides its own free-text escape, so never author a "something else" option. After each answer, react immediately before moving to the next question:
- If correct: brief confirmation, maybe add a nuance they might not have considered.
- If wrong: explain why the right answer is right, don't just say "incorrect."

Comprehension checks like these are graded. Never mark an option "(Recommended)", never put the correct answer first, and never otherwise hint at the answer.

After all questions, give a quick summary: "You got X out of Y. [React naturally based on how they did.]"

Keep it light. This is a check-in, not an exam.
