// PoC (poc/git-version-control): a single commit of a workflow, opened from the commits
// table. Metadata card on top, then the commit viewer (project tree + file content/diff).
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
  const commit = mockCommits.find((item) => item.sha === sha);
  const files = React.useMemo(() => getCommitFiles(sha), [sha]);

  return (
    <LeftSidebarLayout
      location={location}
      title={`Commit ${sha}`}
      backButton={`/workflow/${workflowId}/commits`}
    >
      {commit ? (
        <Stack spacing={4}>
          <CommitMetadata commit={commit} />
          <CommitViewer key={sha} files={files} />
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
