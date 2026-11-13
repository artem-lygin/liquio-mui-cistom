// PoC (poc/git-version-control): commit metadata card, in two modes.
// - Compact (default): one row of columns (author, committed, SHA, message subject, tags).
// - Details: one row per field, with the full message and the release comment. The release
//   comment only appears here.
// "Details" toggles the mode; "Restore" sits on the right in both (mock only, no action yet).
import React from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import TimeLabel from 'components/Label/Time';

import ShaCopy from '../../WorkflowCommits/components/ShaCopy';
import getMessagePreview from '../../WorkflowCommits/messagePreview';

const Row = ({ label, children }) => (
  <>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Box minWidth={0}>{children}</Box>
  </>
);

// Compact column: small label above a one-line value.
const Column = ({ label, children, grow = false }) => (
  <Box minWidth={0} flex={grow ? '1 1 0' : '0 0 auto'}>
    <Typography variant="caption" component="div" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" component="div" noWrap={true}>
      {children}
    </Typography>
  </Box>
);

// Long-form text (message, release comment): keeps line breaks, capped line length.
const LongText = ({ children }) => (
  <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
    {children}
  </Typography>
);

const Tags = ({ tags }) => (
  <Stack direction="row" spacing={1}>
    {tags.map((tag) => (
      <Chip key={tag} size="small" label={tag} color={tag === 'current' ? 'primary' : 'default'} />
    ))}
  </Stack>
);

const CommitMetadata = ({ commit }) => {
  const [details, setDetails] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');

  const actions = (
    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
      <Button
        onClick={() => setDetails((value) => !value)}
        endIcon={details ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        Details
      </Button>
      <Tooltip title="Restore">
        <IconButton>
          <HistoryIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Paper elevation={2}>
      <Box display="flex" alignItems={details ? 'flex-start' : 'center'} gap={4} p={4}>
        {details ? (
          <Box
            flex="1 1 0"
            minWidth={0}
            display="grid"
            gridTemplateColumns="160px minmax(0, 1fr)"
            alignItems="baseline"
            columnGap={4}
            rowGap={4}
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
                <Tags tags={tags} />
              </Row>
            ) : null}
            {version && commit.releaseComment ? (
              <Row label="Release comment">
                <LongText>{commit.releaseComment}</LongText>
              </Row>
            ) : null}
          </Box>
        ) : (
          <Box flex="1 1 0" minWidth={0} display="flex" alignItems="flex-start" gap={4}>
            <Column label="Author">{commit.author}</Column>
            <Column label="Committed">
              <TimeLabel date={commit.committedAt} />
            </Column>
            <Column label="SHA">
              <ShaCopy sha={commit.sha} />
            </Column>
            <Column label="Message" grow={true}>
              {getMessagePreview(commit.message)}
            </Column>
            {tags.length ? (
              <Column label="Tags">
                <Tags tags={tags} />
              </Column>
            ) : null}
          </Box>
        )}
        {actions}
      </Box>
    </Paper>
  );
};

export default CommitMetadata;
