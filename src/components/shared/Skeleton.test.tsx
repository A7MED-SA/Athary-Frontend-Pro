import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, CourseCardSkeleton, DashboardSkeleton } from './Skeleton';

describe('Skeleton', () => {
  it('should render with default variant', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('should render text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild).toHaveClass('h-4', 'rounded');
  });

  it('should render circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });
});

describe('CourseCardSkeleton', () => {
  it('should render course card skeleton', () => {
    render(<CourseCardSkeleton />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('DashboardSkeleton', () => {
  it('should render dashboard skeleton', () => {
    render(<DashboardSkeleton />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
