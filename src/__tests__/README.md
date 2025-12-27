# Test Structure

This project uses a well-organized test structure with the following conventions:

## Directory Structure

```
src/
  __tests__/
    components/          # Component tests
      Header/
        _components/
          NotificationBell.test.tsx
    hooks/               # Custom hook tests
      useNotificationWS.test.tsx
    utils/               # Test utilities and helpers
      test-utils.tsx
    mocks/               # Mock implementations
      websocket.ts
    setup.ts             # Global test setup
```

## Test Organization Principles

1. **Co-located Tests**: Tests are placed in `__tests__` directories that mirror the source code structure
2. **Centralized Utilities**: Shared test utilities, mocks, and setup are in the root `__tests__` directory
3. **Clear Naming**: Test files follow the pattern `*.test.tsx` or `*.test.ts`

## Test Categories

- **Component Tests**: Test React components with `@testing-library/react`
- **Hook Tests**: Test custom React hooks with `renderHook`
- **Integration Tests**: Test component interactions and Redux state management

## Test Setup

- **Framework**: Vitest with jsdom environment
- **Testing Library**: `@testing-library/react` for component testing
- **Mocking**: Manual mocks for external dependencies
- **Coverage**: V8 coverage provider with HTML, JSON, and text reports

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Writing Tests

1. Place test files in `__tests__` directories matching the source structure
2. Use `renderWithProviders` from `utils/test-utils.tsx` for Redux-connected components
3. Mock external dependencies in the `mocks` directory
4. Follow the existing patterns for setup and teardown