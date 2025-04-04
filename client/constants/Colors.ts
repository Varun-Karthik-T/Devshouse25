/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#93bee2'; // Primary color for light mode
const tintColorDark = '#93bee2'; // Primary color for dark mode

export const Colors = {
  light: {
    text: '#11181C', // Dark text for light mode
    background: '#ffffff', // Light background
    tint: tintColorLight, // Primary color
    icon: '#165c95', // Secondary color
    tabIconDefault: '#687076', // Default tab icon color
    tabIconSelected: tintColorLight, // Selected tab icon color
    accent: '#37a0f6', // Accent color
  },
  dark: {
    text: '#e5ebf0', // Light text for dark mode
    background: '#04080b', // Dark background
    tint: tintColorDark, // Primary color
    icon: '#165c95', // Secondary color
    tabIconDefault: '#9BA1A6', // Default tab icon color
    tabIconSelected: tintColorDark, // Selected tab icon color
    accent: '#37a0f6', // Accent color
  },
};