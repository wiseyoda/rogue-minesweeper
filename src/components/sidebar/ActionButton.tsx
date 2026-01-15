/**
 * ActionButton - Full-width sidebar button
 *
 * Wrapper for Button with sidebar-specific styling.
 */

import { Button } from '../ui/Button';
import type { ButtonHTMLAttributes } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ActionButton({ children, ...props }: ActionButtonProps) {
  return (
    <Button
      variant="primary"
      style={{ width: '100%' }}
      {...props}
    >
      {children}
    </Button>
  );
}
