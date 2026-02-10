import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandardAvatar } from './StandardAvatar';

describe('StandardAvatar', () => {
  it('renderiza iniciais quando não há src', () => {
    render(<StandardAvatar name="João Silva" />);
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('renderiza ?? quando name está vazio', () => {
    render(<StandardAvatar />);
    expect(screen.getByText('??')).toBeInTheDocument();
  });

  it('usa duas iniciais para nome composto', () => {
    render(<StandardAvatar name="Maria Santos Costa" />);
    expect(screen.getByText('MS')).toBeInTheDocument();
  });

  it('aplica size via classe', () => {
    const { container } = render(<StandardAvatar name="Test" size="sm" />);
    const el = container.querySelector('.w-6.h-6');
    expect(el).toBeInTheDocument();
  });
});
