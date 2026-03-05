import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import teamsRouter from './routes/teams.js';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Mock authenticated user (hardcoded — no auth in this app)
app.use((req, res, next) => {
  req.user = {
    id: 1,
    name: 'You',
    role: 'Product Manager',
    email: 'pm@taskflow.io',
  };
  next();
});

// Routes
app.use('/api/team', teamsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Only start listening when run directly (not when imported by tests)
if (!process.env.VITEST) {
  app.listen(PORT, () => {
    console.log(`TaskFlow API running on http://localhost:${PORT}`);
  });
}

export default app;
