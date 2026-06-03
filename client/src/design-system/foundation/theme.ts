export const theme = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    textPrimary: '#0a0d13',
    blackAlpha10: 'rgba(0, 0, 0, 0.1)',
    gray900: '#363636',
    blueGray100: '#dce3ea',
    gray100: '#ececec',
    gray300: '#bebebe',
  },
  spacing: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    36: '36px',
  },
  radius: {
    4: '4px',
    8: '8px',
    12: '12px',
    999: '999px',
  },
} as const;

export type AppTheme = typeof theme;
