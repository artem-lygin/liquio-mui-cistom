// PoC (poc/git-version-control): version rules over the mock history (newest first).
import moment from 'moment';

import mockCommits from './mocks/commits';

// A release is a commit with a version tag, i.e. any tag other than 'current' (e.g. '1.2').
export const isRelease = (commit) => (commit.tags || []).some((tag) => tag !== 'current');

// Versions only move forward: only commits after the latest version (newer than it, i.e.
// above it in the newest-first list) can become the next version. Its number is chosen when
// it's created (minor or major step), so it isn't shown in advance. Mock only; a stub for now.
const LATEST_VERSION_INDEX = mockCommits.findIndex(isRelease);
export const canCreateVersion = (commit) =>
  mockCommits.findIndex((item) => item.sha === commit.sha) < LATEST_VERSION_INDEX;

// Tooltip of a version tag pill: the version, plus when and by whom it was created (the
// table has no columns for these, so the tooltip is where they show there).
export const versionTooltip = (tag, commit = {}) => {
  if (tag === 'current') return null;
  const { versionCreatedAt, versionCreatedBy } = commit;
  const created = [
    versionCreatedAt ? moment(versionCreatedAt).format('DD.MM.YYYY HH:mm') : null,
    versionCreatedBy ? `by ${versionCreatedBy}` : null
  ].filter(Boolean);
  return created.length
    ? `Released version ${tag} · created ${created.join(' ')}`
    : `Released version ${tag}`;
};
