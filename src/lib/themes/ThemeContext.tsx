'use client';

import React, { createContext, useContext } from 'react';
import { Theme, ThemeId } from './types';
import { getTheme } from './index';

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme('classic'),
  themeId: 'classic',
});

export function ThemeProvider({
  themeId,
  children,
}: {
  themeId: ThemeId;
  children: React.ReactNode;
}) {
  const theme = getTheme(themeId);
  return (
    <ThemeContext.Provider value={{ theme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
