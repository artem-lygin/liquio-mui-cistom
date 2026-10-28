import storage from 'helpers/storage';

// A plain module-level singleton, not Redux and not a React context on its own — it has to
// outlive the component tree, since react-router v5's flat sibling routes (one per Style
// Guide page) fully unmount the outgoing page on navigation. This object lives for the whole
// SPA session instead, so the next page's fresh StyleGuideStateProvider can rehydrate from
// wherever the previous page left off.
//
// Only the three booleans also persist to localStorage (via the same `storage` singleton
// Navigator.jsx already uses for `expandedCategories`), so they additionally survive a hard
// reload. `draft` (in-progress, unbaked theme token edits) is intentionally kept in memory
// only: it already has an explicit "Reset draft" affordance implying a current-session
// scratchpad, with Bake the only real persistence step — silently surviving a reload days
// later would be a confusing surprise, not a feature.
const BOOLEAN_KEYS = ['editMode', 'showProperties', 'measureEnabled'];
const STORAGE_PREFIX = 'styleGuide.';

const readStoredBoolean = (key, fallback) => {
  const raw = storage.getItem(`${STORAGE_PREFIX}${key}`);
  return raw === 'true' ? true : raw === 'false' ? false : fallback;
};

let state = {
  editMode: readStoredBoolean('editMode', false),
  showProperties: readStoredBoolean('showProperties', true),
  measureEnabled: readStoredBoolean('measureEnabled', false),
  draft: {}
};

export const get = () => state;

export const set = (patch) => {
  state = { ...state, ...patch };
  BOOLEAN_KEYS.forEach((key) => {
    if (key in patch) {
      storage.setItem(`${STORAGE_PREFIX}${key}`, String(patch[key]));
    }
  });
};
