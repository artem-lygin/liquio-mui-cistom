// PoC (poc/git-version-control): compare two commits picked in the commits table. Both
// commits' metadata cards on top (base, then target), then the same commit viewer as the
// commit page, opened on Show difference. The older commit is always the base, whichever
// order the two were picked in. Front-end only: commits and files come from mocks.
import React from 'react';
import { Stack, Typography } from '@mui/material';

import LeftSidebarLayout from 'layouts/LeftSidebar';

import mockCommits from '../WorkflowCommits/mocks/commits';
import { getCompareFiles } from '../WorkflowCommit/mocks/files';
import CommitMetadata from '../WorkflowCommit/components/CommitMetadata';
import CommitViewer from '../WorkflowCommit/components/CommitViewer';

const Side = ({ label, commit }) => (
  <Stack spacing={2}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <CommitMetadata commit={commit} />
  </Stack>
);

const WorkflowComparePage = ({ location, match }) => {
  const { workflowId, baseSha, targetSha } = match.params;
  const base = mockCommits.find((item) => item.sha === baseSha);
  const target = mockCommits.find((item) => item.sha === targetSha);
  const files = React.useMemo(
    () => (base && target ? getCompareFiles(baseSha, targetSha) : []),
    [base, target, baseSha, targetSha]
  );

  return (
    <LeftSidebarLayout
      location={location}
      title="Compare commits"
      backButton={`/workflow/${workflowId}/commits`}
    >
      {base && target ? (
        <Stack spacing={4}>
          <Side label="Base" commit={base} />
          <Side label="Compared with" commit={target} />
          <CommitViewer
            key={`${baseSha}..${targetSha}`}
            files={files}
            base={base}
            target={target}
            defaultShowDiff={true}
          />
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Commit {base ? targetSha : baseSha} not found.
        </Typography>
      )}
    </LeftSidebarLayout>
  );
};

export default WorkflowComparePage;
