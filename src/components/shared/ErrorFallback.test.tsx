import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorFallback } from './ErrorFallback';

describe('ErrorFallback', () => {
  it('should render default error message', () => {
    render(<ErrorFallback />);

    expect(screen.getByText('حدث خطأ')).toBeInTheDocument();
    expect(screen.getByText('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(<ErrorFallback title="Custom Title" message="Custom message" />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorFallback onRetry={onRetry} />);

    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorFallback />);

    expect(screen.queryByText('إعادة المحاولة')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorFallback onRetry={onRetry} />);

    await user.click(screen.getByText('إعادة المحاولة'));

    expect(onRetry).toHaveBeenCalled();
  });
});
