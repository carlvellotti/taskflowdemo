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

describe('Projects API', () => {
  it('POST /api/projects creates a new project', async () => {
    const res = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        description: 'Created by test',
      }),
    });
    const project = await res.json();

    expect(res.status).toBe(201);
    expect(project.name).toBe('Test Project');
    expect(project).toHaveProperty('id');
  });
});
