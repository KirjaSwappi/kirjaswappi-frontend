import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumb from '../../../components/shared/Breadcrumb';

const renderBreadcrumb = (path: string) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Breadcrumb />
    </MemoryRouter>,
  );
};

describe('Breadcrumb', () => {
  it('always renders Home link', () => {
    renderBreadcrumb('/');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders path segments as breadcrumb items', () => {
    renderBreadcrumb('/books');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('capitalizes path segments and replaces dashes with spaces', () => {
    renderBreadcrumb('/my-books');
    expect(screen.getByText('My Books')).toBeInTheDocument();
  });

  it('skips MongoDB-style ObjectId segments', () => {
    renderBreadcrumb('/books/507f1f77bcf86cd799439011');
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.queryByText('507f1f77bcf86cd799439011')).not.toBeInTheDocument();
  });

  it('renders last segment as plain text, not a link', () => {
    renderBreadcrumb('/books/fiction');
    const lastItem = screen.getByText('Fiction');
    expect(lastItem.tagName).not.toBe('A');
    expect(lastItem.tagName).toBe('SPAN');
  });

  it('has aria-label "Breadcrumb"', () => {
    renderBreadcrumb('/books');
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });
});
