// PoC (poc/git-version-control): commit metadata card, in two modes.
// - Compact (default): one unlabeled row: SHA, message subject, then author (person icon)
//   and tags on the right. The committed date isn't here: it's the page title.
// - Details: one row per field, with the full message and the release comment. The release
//   comment only appears here.
// "Details" toggles the mode; "Restore" sits on the right in both (mock only, no action yet).
import React from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/PersonOutline';

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

// Gap between the compact row's groups (SHA + message, author, tags, actions), in spacing
// units: wider than the gap inside a group so each group reads as a separate item.
const GROUP_GAP = 8;

const CommitMetadata = ({ commit }) => {
  const [details, setDetails] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');

  const actions = (
    // No own spacing: the theme's buttonGap puts the gap between Details and Restore.
    <Box display="flex" alignItems="center" flexShrink={0}>
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
    </Box>
  );

  return (
    <Paper elevation={2}>
      <Box display="flex" alignItems={details ? 'flex-start' : 'center'} gap={GROUP_GAP} p={4}>
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
          <Box flex="1 1 0" minWidth={0} display="flex" alignItems="center" gap={GROUP_GAP}>
            <Box flex="1 1 0" minWidth={0} display="flex" alignItems="center" gap={4}>
              <Typography variant="body2" component="div" flexShrink={0}>
                <ShaCopy sha={commit.sha} />
              </Typography>
              <Typography variant="body2" flex="1 1 0" minWidth={0} noWrap={true}>
                {getMessagePreview(commit.message)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap={true}>
                {commit.author}
              </Typography>
            </Stack>
            {tags.length ? <Tags tags={tags} /> : null}
          </Box>
        )}
        {actions}
      </Box>
    </Paper>
  );
};

export default CommitMetadata;
