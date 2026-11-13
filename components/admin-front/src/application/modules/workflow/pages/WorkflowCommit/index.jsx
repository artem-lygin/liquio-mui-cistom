// PoC (poc/git-version-control): a single commit of a workflow, opened from the commits
// table. Metadata card on top,
// then the commit viewer (project tree + file content/diff).
// Front-end only: the commit and its files come from mocks.
import React from 'react';
import { Stack, Typography } from '@mui/material';

import LeftSidebarLayout from 'layouts/LeftSidebar';

import mockCommits from '../WorkflowCommits/mocks/commits';
import { getCommitFiles } from './mocks/files';
import CommitMetadata from './components/CommitMetadata';
import CommitViewer from './components/CommitViewer';

const WorkflowCommitPage = ({ location, match }) => {
  const { workflowId, sha } = match.params;
  const position = mockCommits.findIndex((item) => item.sha === sha);
  const commit = mockCommits[position];
  // Compared against the previous commit (the next one in the newest-first list); the first
  // commit has none. Later the commits table can pick any two commits for base and target.
  const base = mockCommits[position + 1] || null;
  const files = React.useMemo(() => getCommitFiles(sha), [sha]);

  return (
    <LeftSidebarLayout
      location={location}
      title="Version details"
      backButton={`/workflow/${workflowId}/commits`}
    >
      {commit ? (
        <Stack spacing={4}>
          <CommitMetadata commit={commit} />
          <CommitViewer key={sha} files={files} base={base} target={commit} />
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Commit {sha} not found.
        </Typography>
      )}
    </LeftSidebarLayout>
  );
};

export default WorkflowCommitPage;
