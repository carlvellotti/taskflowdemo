import { useState } from 'react';

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--border-radius-md)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    lineHeight: '1.5',
  },
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
  },
  primaryHover: {
    background: 'var(--color-primary-hover)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  secondaryHover: {
    background: 'var(--color-surface-hover)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
  },
  ghostHover: {
    background: 'var(--color-surface-hover)',
    color: 'var(--color-text)',
  },
  small: {
    padding: 'var(--space-1) var(--space-2)',
    fontSize: 'var(--font-size-xs)',
  },
};

export default function Button({ children, variant = 'primary', size, onClick, disabled, style: customStyle, ...props }) {
  const [hovered, setHovered] = useState(false);

  const variantStyle = styles[variant] || styles.primary;
  const hoverStyle = hovered ? (styles[`${variant}Hover`] || {}) : {};
  const sizeStyle = size === 'small' ? styles.small : {};

  return (
    <button
      style={{
        ...styles.base,
        ...variantStyle,
        ...sizeStyle,
        ...hoverStyle,
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...customStyle,
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
