// Design tokens — shared across PM Desktop, iPad app, and reports.
// Mirror what's in globals.css so JSX inline styles can reference the same values.
export const theme = {
  bg: '#F4EFE6',
  bgSoft: '#EDE7DC',
  card: '#FFFFFF',
  navy: '#0F2340',
  navyHover: '#1A3558',
  accent: '#C8553D',
  accentHover: '#A8432E',
  ink: '#0F0F0F',
  inkMuted: '#4A4A4A',
  inkLight: '#8A8A8A',
  line: '#E8E1D2',
  lineStrong: '#D4CBB8',
  success: '#3F6E4E',
  successBg: 'rgba(63,110,78,0.1)',
  warn: '#B8892F',
  warnBg: 'rgba(184,137,47,0.12)',
  danger: '#B04030',
  shadowSm: '0 1px 2px rgba(15,35,64,0.04), 0 1px 1px rgba(15,35,64,0.03)',
  shadowMd: '0 4px 12px rgba(15,35,64,0.05), 0 2px 4px rgba(15,35,64,0.04)',
  shadowLg: '0 12px 32px rgba(15,35,64,0.08), 0 4px 8px rgba(15,35,64,0.04)',
} as const;
