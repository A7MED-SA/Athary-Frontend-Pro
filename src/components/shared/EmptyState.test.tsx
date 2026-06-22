import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render title', () => {
    render(<EmptyState title="No data" />);

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<EmptyState title="No data" description="There is nothing here" />);

    expect(screen.getByText('There is nothing here')).toBeInTheDocument();
  });

  it('should render action button', () => {
    const onClick = vi.fn();
    render(<EmptyState title="No data" action={{ label: 'Add Item', onClick }} />);

    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('should call action onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<EmptyState title="No data" action={{ label: 'Add Item', onClick }} />);

    await user.click(screen.getByText('Add Item'));

    expect(onClick).toHaveBeenCalled();
  });

  it('should not render action button when action is not provided', () => {
    render(<EmptyState title="No data" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
