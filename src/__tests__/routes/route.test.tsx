import { describe, expect, it, vi } from 'vitest';

vi.mock('../../App', () => ({ default: () => <div>App</div> }));
vi.mock('../../components/error/AppErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../components/error/GlobalError', () => ({ default: () => <div>Error</div> }));
vi.mock('../../components/error/NotFound', () => ({ default: () => <div>Not Found</div> }));
vi.mock('../../components/shared/Spinner', () => ({ default: () => <div>Loading</div> }));
vi.mock('../../pages/auth/login', () => ({ default: () => <div>Login</div> }));
vi.mock('../../pages/auth/register', () => ({ default: () => <div>Register</div> }));
vi.mock('../../pages/auth/resetPassword', () => ({ default: () => <div>ResetPassword</div> }));
vi.mock('../../pages/bookDetails', () => ({ default: () => <div>BookDetails</div> }));
vi.mock('../../pages/books', () => ({ default: () => <div>Books</div> }));
vi.mock('../../pages/profile', () => ({ default: () => <div>Profile</div> }));
vi.mock('../../routes/Authenticate', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../routes/PrivateRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import routes from '../../routes/route';

function collectPaths(routeObjects: { path?: string; children?: unknown[] }[]): string[] {
  const paths: string[] = [];
  for (const route of routeObjects) {
    if (route.path !== undefined) paths.push(route.path);
    if (route.children) {
      paths.push(...collectPaths(route.children as { path?: string; children?: unknown[] }[]));
    }
  }
  return paths;
}

describe('Application Routes', () => {
  it('should be defined', () => {
    expect(routes).toBeDefined();
  });

  it('should have children routes', () => {
    const routerRoutes = (routes as unknown as { routes: { children: unknown[] }[] }).routes;
    expect(routerRoutes).toBeDefined();
    expect(routerRoutes[0].children).toBeDefined();
    expect(routerRoutes[0].children.length).toBeGreaterThan(0);
  });

  it('should contain key paths', () => {
    const routerRoutes = (
      routes as unknown as { routes: { path?: string; children?: unknown[] }[] }
    ).routes;
    const allPaths = collectPaths(routerRoutes);

    expect(allPaths).toContain('/');
    expect(allPaths).toContain('/map');
    expect(allPaths).toContain('/auth/login');
    expect(allPaths).toContain('/auth/register');
    expect(allPaths).toContain('/password/reset');
    expect(allPaths).toContain('/profile');
    expect(allPaths).toContain('*');
  });
});
