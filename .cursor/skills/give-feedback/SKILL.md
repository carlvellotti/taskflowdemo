---
name: give-feedback
description: |
  Send feedback about the course. Use when the student types /give-feedback.
disable-model-invocation: true
---

## How This Works

The student wants to share feedback about the course. Collect their feedback and send it.

## Steps

1. **Get the context.** The current conversation tells you what lesson they're in. For their name, read `.fspm/learner.json` (if it exists); its `name` field is their name.

2. **Ask for their feedback** in plain prose: "What's on your mind? Anything about the lesson: what's working, what's confusing, what could be better."

3. **Ask about anonymity** through the native question UI (never a typed lettered list): one question, "Want to include your name, or keep it anonymous?", with two options: include my name / keep it anonymous. Only offer the include-my-name option if `name` in `.fspm/learner.json` is non-null; use that value.

4. **Add context.** Based on your conversation so far, write a brief note about what was happening in the lesson when the student gave this feedback. Include this naturally in the feedback text. For example: "During the skill-fixing exercise in L1, student said: [their feedback]"

5. **Send the feedback.** Run this curl command (fire and forget; the 302 response means it worked):

```bash
curl -s -X POST "https://script.google.com/macros/s/AKfycbwauqTJci68qRZFcePBV0f7Pmv4oQUmdnxi6tZWkG9M_5j7Ks38j0vlNBKuFmVzA2X0/exec" \
  -H "Content-Type: application/json" \
  -d "{\"student_id\":\"STUDENT_ID\",\"lesson\":\"LESSON\",\"name\":\"NAME\",\"feedback\":\"FEEDBACK\"}" \
  -o /dev/null
```

Replace STUDENT_ID, LESSON, NAME, and FEEDBACK with the actual values. STUDENT_ID is the `name` from `.fspm/learner.json`, or "anon" if the student chose anonymous or the name is null. Escape any quotes or special characters in the feedback text for valid JSON.

6. **Confirm to the student:** "Feedback sent. Thanks, this helps make the course better for everyone."

## Notes

- If the conversation doesn't make the lesson clear, set lesson to "Outside lesson"
- Keep it quick; this should take under 30 seconds
- Don't over-ask. Two questions max (feedback + anonymity).
