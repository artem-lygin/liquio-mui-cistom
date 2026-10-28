import React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { isEmpty, setPath } from './utils';
import * as styleGuideStore from './store';

const StyleGuideContext = React.createContext(null);

export const useStyleGuideState = () => {
  const context = React.useContext(StyleGuideContext);
  if (!context) {
    throw new Error('useStyleGuideState must be used within a StyleGuideStateProvider');
  }
  return context;
};

// Mounted fresh by every Style Guide page (one route each, under react-router v5's flat
// sibling <Switch> — there's no persistent wrapper position across navigations). Its useState
// initial values are lazily read from the store singleton, so even though this Provider
// instance itself is destroyed/recreated on every page navigation, the *values* it starts
// with are whatever the previous page last wrote — every setter here updates both local
// React state (driving this page's live re-render) and the store (so the *next* page picks
// up from here).
const StyleGuideStateProvider = ({ children }) => {
  const baseTheme = useTheme();
  const [editMode, setEditModeState] = React.useState(() => styleGuideStore.get().editMode);
  const [showProperties, setShowPropertiesState] = React.useState(() => styleGuideStore.get().showProperties);
  const [measureEnabled, setMeasureEnabledState] = React.useState(() => styleGuideStore.get().measureEnabled);
  const [draft, setDraftState] = React.useState(() => styleGuideStore.get().draft);
  const [baking, setBaking] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const setEditMode = (value) => {
    setEditModeState(value);
    styleGuideStore.set({ editMode: value });
  };

  const setShowProperties = (value) => {
    setShowPropertiesState(value);
    styleGuideStore.set({ showProperties: value });
  };

  const setMeasureEnabled = (value) => {
    setMeasureEnabledState(value);
    styleGuideStore.set({ measureEnabled: value });
  };

  const setDraft = (updater) => {
    setDraftState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      styleGuideStore.set({ draft: next });
      return next;
    });
  };

  const updateDraft = (pathSegments, value) => {
    setDraft((prev) => setPath(prev, pathSegments, value));
  };

  const resetDraft = () => setDraft({});

  const previewTheme = React.useMemo(
    () => (isEmpty(draft) ? baseTheme : createTheme(baseTheme, draft)),
    [baseTheme, draft]
  );

  const rootFontSize = draft.typography?.htmlFontSize ?? previewTheme.typography.htmlFontSize;

  React.useEffect(() => {
    // 1rem is defined relative to the <html> element's font-size, not a MUI/palette value —
    // MUI's own `typography.htmlFontSize` only feeds its internal pxToRem() math, it never
    // touches the DOM. So making it live requires setting the root font-size ourselves.
    document.documentElement.style.fontSize = `${rootFontSize}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [rootFontSize]);

  const handleBake = async () => {
    setBaking(true);
    try {
      const response = await fetch('/__dev/bake-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const result = await response.json();
      setSnackbarMessage(
        result.ok
          ? 'Baked into theme.overrides.json — restart npm start to make it the new baseline.'
          : `Bake failed: ${result.error}`
      );
    } catch (error) {
      setSnackbarMessage(`Bake failed: ${error.message}`);
    } finally {
      setBaking(false);
    }
  };

  const value = {
    previewTheme,
    rootFontSize,
    editMode,
    setEditMode,
    showProperties,
    setShowProperties,
    measureEnabled,
    setMeasureEnabled,
    draft,
    updateDraft,
    resetDraft,
    baking,
    handleBake,
    snackbarMessage,
    setSnackbarMessage
  };

  return (
    <StyleGuideContext.Provider value={value}>
      <ThemeProvider theme={previewTheme}>{children}</ThemeProvider>
    </StyleGuideContext.Provider>
  );
};

export default StyleGuideStateProvider;
