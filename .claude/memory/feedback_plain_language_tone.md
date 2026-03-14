---
name: PM-friendly writing tone
description: When writing for PMs, be direct and concrete — like an engineer explaining the app over lunch. No metaphors, no dumbing down. Focus on user actions, data relationships, and feature behavior.
type: feedback
---

PM-friendly summaries should read like an engineer explaining the app to their PM over lunch. Direct, concrete, no metaphors or analogies, no dumbing down.

**Why:** PMs are technical enough to understand endpoints, data models, and how features connect. They don't need to know framework internals or file paths, but they also don't need things explained like they've never seen a web app. Metaphors (restaurant/kitchen/pantry) come across as patronizing.

**How to apply:** Focus on what users can do and how those features actually work. "When a user creates a task, the form posts to /api/tasks with title, status, priority..." is the right level. Name endpoints and technologies without explaining what they are. Describe data relationships (tasks belong to projects, projects have owners). Call out bugs and missing features. Skip file paths, version numbers, and code patterns — those go in the "Full detail" layer.
