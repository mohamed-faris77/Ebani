import React from 'react';
import { theme } from '../theme';

export default function Card({ children, style }) {
  return (
    //global design for all modules
    <div
      style={{
        background: theme.colors.card,
        boxShadow: theme.boxShadow,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        margin: theme.spacing.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
