import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import theme from '../../theme';
import PageHeader from './PageHeader';

const wrap = (ui) =>
  render(<MantineProvider theme={theme}>{ui}</MantineProvider>);

describe('PageHeader', () => {
  it('renderiza título', () => {
    wrap(<PageHeader title="Meu Título" />);
    expect(screen.getByRole('heading', { name: /meu título/i })).toBeInTheDocument();
  });

  it('renderiza botão de ação quando actionButton é passado', () => {
    const onClick = vi.fn();
    wrap(
      <PageHeader
        title="Página"
        actionButton={{ label: 'Criar', onClick, icon: null }}
      />
    );
    const btn = screen.getByRole('button', { name: /criar/i });
    expect(btn).toBeInTheDocument();
    btn.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não renderiza botão quando actionButton é undefined', () => {
    wrap(<PageHeader title="Só Título" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
