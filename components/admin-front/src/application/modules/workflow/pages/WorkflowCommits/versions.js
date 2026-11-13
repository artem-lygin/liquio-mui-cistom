// PoC (poc/git-version-control): version rules over the mock history (newest first).
import mockCommits from './mocks/commits';

// A release is a commit with a version tag, i.e. any tag other than 'current' (e.g. '1.2').
export const isRelease = (commit) => (commit.tags || []).some((tag) => tag !== 'current');

// Versions only move forward: only commits after the latest version (newer than it, i.e.
// above it in the newest-first list) can become the next version, which is the latest
// version's minor number + 1 (1.3 -> 1.4). Mock only; creating it is a stub for now.
const LATEST_VERSION_INDEX = mockCommits.findIndex(isRelease);
const LATEST_VERSION = mockCommits[LATEST_VERSION_INDEX].tags.find((tag) => tag !== 'current');
export const NEXT_VERSION = LATEST_VERSION.replace(/\d+$/, (minor) => String(Number(minor) + 1));
export const canCreateVersion = (commit) =>
  mockCommits.findIndex((item) => item.sha === commit.sha) < LATEST_VERSION_INDEX;
