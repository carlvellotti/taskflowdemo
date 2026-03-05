import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskRow from '../../client/src/components/tasks/TaskRow';

describe('TaskRow', () => {
  it('renders task title and assignee', () => {
    const task = {
      id: 1,
      title: 'Build login page',
      status: 'in-progress',
      priority: 'high',
      assignee_name: 'Rachel Torres',
      project_name: 'Dashboard Redesign',
      due_date: '2026-03-10',
    };

    render(<TaskRow task={task} />);

    expect(screen.getByText('Build login page')).toBeInTheDocument();
    expect(screen.getByText('Rachel Torres')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Redesign')).toBeInTheDocument();
  });
});
