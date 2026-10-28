import { history } from 'store';

// Used wherever a cross-page reference (a properties-table row's anchor, an inline
// description link) needs to jump to a different Style Guide page — these are callback-
// shaped (threaded through generic, data-driven renderers like PropertiesCardGroup), not
// simple static <Link> destinations, so they stay imperative. Every existing anchor target
// already equals a top-level section id 1:1, which is also its route segment.
export const navigateToSection = (id) => {
  history.push(`/style-guide/${id}`);
};
