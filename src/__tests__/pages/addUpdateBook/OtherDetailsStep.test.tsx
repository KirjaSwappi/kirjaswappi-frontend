import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('react-icons/bi', () => ({
  BiTargetLock: () => <span>target</span>,
}));

vi.mock('../../../assets/addGenre.png', () => ({ default: 'addGenre.png' }));
vi.mock('../../../assets/closeIcon.png', () => ({ default: 'close.png' }));
vi.mock('../../../assets/genreAddPlus.png', () => ({ default: 'plus.png' }));
vi.mock('../../../assets/mapIcon.png', () => ({ default: 'map.png' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string }) => <label>{label}</label>,
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setOpen: (p: unknown) => ({ type: 'open/setOpen', payload: p }),
}));

vi.mock('../../../pages/addUpdateBook/_components/LocationMap', () => ({
  default: () => <div data-testid="location-map">Map</div>,
}));

import OtherDetailsStep from '../../../pages/addUpdateBook/_components/OtherDetailsStep';

function Wrapper({ genres = [], address = null }: { genres?: string[]; address?: unknown }) {
  const store = configureStore({
    reducer: {
      open: (state = { open: false }) => state,
    },
  });

  const FormWrapper = () => {
    const methods = useForm({
      defaultValues: { genres, address },
    });
    return (
      <FormProvider {...methods}>
        <OtherDetailsStep errors={{}} />
      </FormProvider>
    );
  };

  return (
    <Provider store={store}>
      <FormWrapper />
    </Provider>
  );
}

describe('OtherDetailsStep', () => {
  it('renders genre label', () => {
    render(<Wrapper />);
    expect(screen.getByText('Genre')).toBeInTheDocument();
  });

  it('renders location label', () => {
    render(<Wrapper />);
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('renders add genre placeholder when no genres', () => {
    render(<Wrapper />);
    expect(screen.getByText(/to add genre/)).toBeInTheDocument();
  });

  it('renders genres when provided', () => {
    render(<Wrapper genres={['Fiction', 'Science']} />);
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('renders add location placeholder when no address', () => {
    render(<Wrapper />);
    expect(screen.getByText(/to add location/)).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<Wrapper />);
    expect(screen.getByPlaceholderText('Search for a location...')).toBeInTheDocument();
  });

  it('renders current location button', () => {
    render(<Wrapper />);
    expect(screen.getByTitle('Use current location')).toBeInTheDocument();
  });

  it('renders map when address is set', () => {
    render(
      <Wrapper
        address={{
          latitude: 60.1699,
          longitude: 24.9384,
          address: 'Helsinki',
          city: 'Helsinki',
          country: 'Finland',
          postalCode: '00100',
          radiusKm: 50,
        }}
      />,
    );
    expect(screen.getByTestId('location-map')).toBeInTheDocument();
  });
});
