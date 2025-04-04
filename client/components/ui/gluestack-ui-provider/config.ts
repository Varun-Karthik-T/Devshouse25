'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    '--color-primary': '147 190 226', // Primary color
    '--color-secondary': '22 92 149', // Secondary color
    '--color-accent': '55 160 246', // Accent color
    '--color-text': '229 235 240', // Text color
    '--color-background': '4 8 11', // Background color

    // Existing colors (if needed)
    '--color-primary-0': '179 179 179',
    '--color-primary-50': '153 153 153',
    '--color-primary-100': '128 128 128',
    // ...other colors
  }),
  dark: vars({
    '--color-primary': '147 190 226', // Primary color
    '--color-secondary': '22 92 149', // Secondary color
    '--color-accent': '55 160 246', // Accent color
    '--color-text': '229 235 240', // Text color
    '--color-background': '4 8 11', // Background color

    // Existing colors (if needed)
    '--color-primary-0': '166 166 166',
    '--color-primary-50': '175 175 175',
    '--color-primary-100': '186 186 186',
    // ...other colors
  }),
};