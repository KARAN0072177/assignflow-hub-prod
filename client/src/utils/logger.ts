/**
 * Frontend Console Cleanliness Utility
 * Suppresses sensitive debugging statements and cleans browser dev console in production
 */

export const initConsoleHygiene = () => {
  if (import.meta.env.PROD) {
    // Disable console logs in production builds
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
  }
};
