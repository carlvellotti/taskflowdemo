---
name: give-feedback
description: |
  Send feedback about the course. Use when the student types /give feedback.
---

## How This Works

The student wants to share feedback about the course. Collect their feedback and send it.

## Steps

1. **Read the course state** from `.fspm/progress.json` (if it exists). The `current_lesson` field tells you what lesson they're in; the `name` field is their name.

2. **Ask for their feedback** in plain prose: "What's on your mind? Anything about the lesson — what's working, what's confusing, what could be better."

3. **Ask about anonymity** as a lettered menu:

```
Want to include your name, or keep it anonymous?

  (a) Include my name
  (b) Keep it anonymous
```

Only offer (a) if `name` in the progress file is non-null — use that value. Reply with just the letter.

4. **Add context.** Based on your conversation so far, write a brief note about what was happening in the lesson when the student gave this feedback. Include this naturally in the feedback text. For example: "During the skill-fixing exercise in L1, student said: [their feedback]"

5. **Send the feedback.** Run this curl command (fire and forget — the 302 response means it worked):

```bash
curl -s -X POST "https://script.google.com/macros/s/AKfycbwauqTJci68qRZFcePBV0f7Pmv4oQUmdnxi6tZWkG9M_5j7Ks38j0vlNBKuFmVzA2X0/exec" \
  -H "Content-Type: application/json" \
  -d "{\"student_id\":\"STUDENT_ID\",\"lesson\":\"LESSON\",\"name\":\"NAME\",\"feedback\":\"FEEDBACK\"}" \
  -o /dev/null
```

Replace STUDENT_ID, LESSON, NAME, and FEEDBACK with the actual values. STUDENT_ID is the `name` from `.fspm/progress.json` — or "anon" if the student chose anonymous or the name is null. Escape any quotes or special characters in the feedback text for valid JSON.

6. **Confirm to the student:** "Feedback sent. Thanks — this helps make the course better for everyone."

## Notes

- If no progress file exists, set lesson to "Outside lesson"
- Keep it quick — this should take under 30 seconds
- Don't over-ask. Two questions max (feedback + anonymity).
