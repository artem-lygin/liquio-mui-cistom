// PoC (poc/git-version-control): compare two commits picked in the commits table. One panel
// on top with both commits' rows (the diff goes from the top one to the bottom one), each with
// a "Newer" / "Older" pill instead of base/compared terms, and a swap button on its left that
// flips them, so the diff can be read either way (what was added since the older one, or what
// was removed relative to the newer one). Then the same commit viewer as
// the commit page, opened on Show difference. From the table the older commit is the base;
// swapping just reverses the URL. Front-end only: commits and files come from mocks.
import React from 'react';
import { Box, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import SwapIcon from '@mui/icons-material/SwapVert';

import { history } from 'store';
import LeftSidebarLayout from 'layouts/LeftSidebar';

import mockCommits from '../WorkflowCommits/mocks/commits';
import { getCompareFiles } from '../WorkflowCommit/mocks/files';
import { CommitRow } from '../WorkflowCommit/components/CommitMetadata';
import CommitViewer from '../WorkflowCommit/components/CommitViewer';

const WorkflowComparePage = ({ location, match }) => {
  const { workflowId, baseSha, targetSha } = match.params;
  const base = mockCommits.find((item) => item.sha === baseSha);
  const target = mockCommits.find((item) => item.sha === targetSha);
  const files = React.useMemo(
    () => (base && target ? getCompareFiles(baseSha, targetSha) : []),
    [base, target, baseSha, targetSha]
  );

  const newerSha = base && target && base.committedAt > target.committedAt ? baseSha : targetSha;
  const ageOf = (commit) => (commit.sha === newerSha ? 'Newer' : 'Older');

  const handleSwap = () =>
    history.push(`/workflow/${workflowId}/commits/compare/${targetSha}/${baseSha}`);

  return (
    <LeftSidebarLayout
      location={location}
      title="Compare commits"
      backButton={`/workflow/${workflowId}/commits`}
    >
      {base && target ? (
        <Stack spacing={4}>
          <Paper elevation={2} sx={{ display: 'flex', overflow: 'hidden' }}>
            <Box
              display="flex"
              alignItems="center"
              px={2}
              borderRight={1}
              borderColor="divider"
              flexShrink={0}
            >
              <Tooltip title="Swap order">
                <IconButton onClick={handleSwap}>
                  <SwapIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box flex={1} minWidth={0}>
              <CommitRow key={baseSha} age={ageOf(base)} commit={base} />
              <Divider />
              <CommitRow key={targetSha} age={ageOf(target)} commit={target} />
            </Box>
          </Paper>
          <CommitViewer
            // Same key both ways round: swapping keeps the selected file and the diff toggle.
            key={[baseSha, targetSha].sort().join('..')}
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
