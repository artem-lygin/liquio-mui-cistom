// Pure immutable nested-object setter. Deliberately not lodash's `set` with a dotted string:
// lodash treats numeric-looking segments (e.g. grey scale keys like "50") as array indices,
// which would turn theme.palette.grey into a sparse array instead of an object.
export const setPath = (obj, pathSegments, value) => {
  if (pathSegments.length === 0) {
    return value;
  }
  const [head, ...rest] = pathSegments;
  const current = obj && typeof obj === 'object' ? obj : {};
  return { ...current, [head]: setPath(current[head], rest, value) };
};

export const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

export const resolvePath = (obj, pathSegments) => pathSegments.reduce((acc, key) => (acc ? acc[key] : undefined), obj);

// Converts a CSS fontSize value — a bare number (MUI/JSS convention: px) or a 'Nrem'/'Npx'
// string — to an actual pixel number, given the currently active root font-size. Shared by
// every fontSize-to-px calculation (Buttons' own sizing, and the Typography page's
// per-variant notes) so the conversion itself lives in exactly one place rather than being
// reimplemented, and stays correct if the root font-size is ever edited live.
export const fontSizeToPx = (fontSize, rootFontSize) => {
  if (typeof fontSize === 'number') return fontSize;
  return fontSize.endsWith('px') ? parseFloat(fontSize) : parseFloat(fontSize) * rootFontSize;
};
