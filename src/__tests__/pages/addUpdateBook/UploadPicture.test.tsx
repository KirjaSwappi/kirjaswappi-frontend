import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../components/shared/Input', () => ({
  default: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

import UploadPicture from '../../../pages/addUpdateBook/_components/UploadPicture';

describe('UploadPicture', () => {
  it('renders + icon', () => {
    render(<UploadPicture />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders Upload Picture text by default', () => {
    render(<UploadPicture />);
    expect(screen.getByText('Upload Picture')).toBeInTheDocument();
  });

  it('hides Upload Picture text when isShow=false', () => {
    render(<UploadPicture isShow={false} />);
    expect(screen.queryByText('Upload Picture')).not.toBeInTheDocument();
  });

  it('renders file input with custom id', () => {
    render(<UploadPicture id="my-file" />);
    const input = document.getElementById('my-file') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('uses default id of file', () => {
    render(<UploadPicture />);
    const input = document.getElementById('file') as HTMLInputElement;
    expect(input).toBeTruthy();
  });
});
