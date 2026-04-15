import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/fa', () => ({
  FaRegUser: () => <span data-testid="user-icon">user</span>,
}));

vi.mock('react-icons/io5', () => ({
  IoCamera: () => <span>camera</span>,
}));

vi.mock('../../../assets/bookdetailsbg.jpg', () => ({ default: 'bg.jpg' }));
vi.mock('../../../assets/close.svg', () => ({ default: 'close.svg' }));
vi.mock('../../../assets/leftArrow.png', () => ({ default: 'left.png' }));
vi.mock('../../../assets/location-icon.png', () => ({ default: 'location.png' }));

vi.mock('../../../components/shared/AddGenre', () => ({
  default: () => <div data-testid="add-genre">AddGenre</div>,
}));

vi.mock('../../../components/shared/AlertModal', () => ({
  default: ({ yes, no }: { yes: () => void; no: () => void }) => (
    <div data-testid="alert-modal">
      <button onClick={yes}>Yes</button>
      <button onClick={no}>No</button>
    </div>
  ),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: string;
  }) => (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt || ''} src={src} />,
}));

vi.mock('../../../components/shared/Input', () => ({
  default: ({
    name,
    value,
    onChange,
    placeholder,
  }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={`input-${name}`}
    />
  ),
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string }) => <label>{label}</label>,
}));

vi.mock('../../../components/shared/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../../components/shared/TextArea', () => ({
  default: ({
    name,
    value,
    onChange,
    placeholder,
  }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
  }) => (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={`textarea-${name}`}
    />
  ),
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

vi.mock('../../../hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    imageFile: null,
    handleImageFile: vi.fn(),
    error: '',
    previewImage: '',
    handleRemove: vi.fn(),
    handleSetPreviewImage: vi.fn(),
    handleClearState: vi.fn(),
    isShowModal: false,
    handleShowModal: vi.fn(),
    setShowModal: vi.fn(),
  }),
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useDeleteCoverImageMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteProfileImageMutation: () => [vi.fn(), { isLoading: false }],
  useGetUserCoverImageQuery: () => ({ data: { imageUrl: '' }, isSuccess: true }),
  useGetUserProfileImageQuery: () => ({ data: { imageUrl: '' }, isSuccess: true }),
  useUpdateUserByIdMutation: () => [vi.fn(), { isLoading: false }],
  useUploadCoverImageMutation: () => [vi.fn(), { isLoading: false }],
  useUploadProfileImageMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('../../../redux/feature/notification/notificationSlice', () => ({
  setAlert: (payload: unknown) => ({ type: 'notification/setAlert', payload }),
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setOpen: (payload: unknown) => ({ type: 'open/setOpen', payload }),
}));

import EditProfile from '../../../pages/profile/components/EditProfile';

describe('EditProfile', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (
          state = {
            userInformation: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe',
              aboutMe: 'Bio text',
              favGenres: ['Fiction'],
            },
          },
        ) => state,
        open: (state = { open: false }) => state,
        notification: (state = { alertType: '' }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <EditProfile />
        </MemoryRouter>
      </Provider>,
    );

  it('renders edit profile title', () => {
    renderComponent();
    const titles = screen.getAllByText('editProfile.title');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders save button', () => {
    renderComponent();
    const saveButtons = screen.getAllByText('save');
    expect(saveButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders profile picture section', () => {
    renderComponent();
    expect(screen.getByText('editProfile.profilePicture')).toBeInTheDocument();
  });

  it('renders cover picture section', () => {
    renderComponent();
    expect(screen.getByText('editProfile.coverPicture')).toBeInTheDocument();
  });

  it('renders first name input with value', () => {
    renderComponent();
    const input = screen.getByTestId('input-firstName');
    expect(input).toHaveValue('John');
  });

  it('renders last name input with value', () => {
    renderComponent();
    const input = screen.getByTestId('input-lastName');
    expect(input).toHaveValue('Doe');
  });

  it('renders bio textarea with value', () => {
    renderComponent();
    const textarea = screen.getByTestId('textarea-aboutMe');
    expect(textarea).toHaveValue('Bio text');
  });

  it('renders genre section with add button', () => {
    renderComponent();
    expect(screen.getByText('editProfile.genre')).toBeInTheDocument();
    expect(screen.getByText('add')).toBeInTheDocument();
  });

  it('renders favorite genres', () => {
    renderComponent();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
  });

  it('renders location section', () => {
    renderComponent();
    expect(screen.getByText('editProfile.location')).toBeInTheDocument();
  });

  it('handles first name change', () => {
    renderComponent();
    const input = screen.getByTestId('input-firstName');
    fireEvent.change(input, { target: { name: 'firstName', value: 'Jane' } });
    expect(input).toHaveValue('Jane');
  });

  it('renders back button', () => {
    renderComponent();
    expect(screen.getByLabelText('Go back to profile')).toBeInTheDocument();
  });

  it('renders alert modal', () => {
    renderComponent();
    expect(screen.getByTestId('alert-modal')).toBeInTheDocument();
  });

  it('renders add genre component', () => {
    renderComponent();
    expect(screen.getByTestId('add-genre')).toBeInTheDocument();
  });
});
