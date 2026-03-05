import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../server/index.js';

let server;
let baseUrl;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/api`;
      resolve();
    });
  });
});

afterAll(() => {
  server?.close();
});

describe('Tasks API', () => {
  it('GET /api/tasks returns all tasks', async () => {
    const res = await fetch(`${baseUrl}/tasks`);
    const tasks = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty('title');
    expect(tasks[0]).toHaveProperty('status');
  });

  it('GET /api/tasks?status=done returns only completed tasks', async () => {
    const res = await fetch(`${baseUrl}/tasks?status=done`);
    const tasks = await res.json();

    expect(res.status).toBe(200);
    expect(tasks.every((t) => t.status === 'done')).toBe(true);
  });
});
