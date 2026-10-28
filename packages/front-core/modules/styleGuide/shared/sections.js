// Top-level pages of the Style Guide — drives the left SideNav and, via each id, the route
// segment each page lives at (/style-guide/<id>).
export const SECTIONS = [
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'icon-library', label: 'Icon library' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'chips', label: 'Chips' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'alert', label: 'Alert' }
];

// Conceptual write-ups that don't belong to one specific component — how a piece of the
// theme system works in general. Rendered after a divider at the bottom of the side nav.
export const EXPLAINER_SECTIONS = [{ id: 'overrides-vs-palette', label: 'Overrides vs. palette' }];
