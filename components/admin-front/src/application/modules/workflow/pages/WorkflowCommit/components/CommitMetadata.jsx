// PoC (poc/git-version-control): commit metadata card. One row per field; tags and the
// release comment only appear when the commit has them.
import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import TimeLabel from 'components/Label/Time';

import ShaCopy from '../../WorkflowCommits/components/ShaCopy';

const Row = ({ label, children }) => (
  <>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Box minWidth={0}>{children}</Box>
  </>
);

// Long-form text (message, release comment): keeps line breaks, capped line length.
const LongText = ({ children }) => (
  <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
    {children}
  </Typography>
);

const CommitMetadata = ({ commit }) => {
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');

  return (
    <Paper elevation={2}>
      <Box
        display="grid"
        gridTemplateColumns="160px minmax(0, 1fr)"
        alignItems="baseline"
        columnGap={4}
        rowGap={4}
        p={4}
      >
        <Row label="Author">
          <Typography variant="body2">{commit.author}</Typography>
        </Row>
        <Row label="Committed">
          <Typography variant="body2" component="div">
            <TimeLabel date={commit.committedAt} />
          </Typography>
        </Row>
        <Row label="SHA">
          <Typography variant="body2" component="div">
            <ShaCopy sha={commit.sha} />
          </Typography>
        </Row>
        <Row label="Message">
          <LongText>{commit.message}</LongText>
        </Row>
        {tags.length ? (
          <Row label="Tags">
            <Stack direction="row" spacing={1}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  color={tag === 'current' ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Row>
        ) : null}
        {version && commit.releaseComment ? (
          <Row label="Release comment">
            <LongText>{commit.releaseComment}</LongText>
          </Row>
        ) : null}
      </Box>
    </Paper>
  );
};

export default CommitMetadata;
