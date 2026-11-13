// PoC (poc/git-version-control): commit metadata card, in two modes.
// - Compact (default): one row laid out like a row of the commits table: committed date with
//   "by <author>", the message (up to two lines), then "Version" + tags, SHA and actions.
// - Details: one row per field, with the full message and the release comment. The release
//   comment only appears here.
// Click the compact row (or the chevron) to expand; the chevron collapses. Restore sits left of
// the chevron in both modes (mock only, no action yet).
import React from 'react';
import { Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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

const Tags = ({ tags }) => (
  <Stack direction="row" spacing={1}>
    {tags.map((tag) => (
      <Chip key={tag} size="small" label={tag} color={tag === 'current' ? 'primary' : 'default'} />
    ))}
  </Stack>
);

// Compact message, cut to two lines with an ellipsis. Messages are normally one line; a rare
// line break is kept, but empty lines are dropped.
const compactMessage = (message = '') => message.replace(/\n\s*\n/g, '\n').trim();
const MESSAGE_CLAMP = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden'
};

// Gap between the compact row's columns (date, message, tags, SHA, actions), in spacing
// units: wider than the gap inside a group so each group reads as a separate item.
const GROUP_GAP = 8;

const CommitMetadata = ({ commit }) => {
  const [details, setDetails] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');

  const toggle = () => setDetails((value) => !value);

  // Compact: the whole card is the toggle (hover highlight, click or Enter/Space to expand).
  // Details: only the chevron collapses it, so the full text can be selected and copied.
  const rowProps = details
    ? {}
    : {
        role: 'button',
        tabIndex: 0,
        'aria-expanded': false,
        onClick: toggle,
        onKeyDown: (event) => {
          if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggle();
          }
        },
        sx: {
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'action.hover' },
          '&:focus-visible': { backgroundColor: 'action.focus', outline: 'none' }
        }
      };

  const actions = (
    // Restore, then the chevron at the far right. No own spacing: the theme's buttonGap puts
    // the gap between them. Clicks here don't reach the row toggle.
    <Box display="flex" alignItems="center" flexShrink={0} onClick={(event) => event.stopPropagation()}>
      <Tooltip title="Restore">
        <IconButton>
          <HistoryIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={details ? 'Hide details' : 'Show details'}>
        <IconButton onClick={toggle} aria-expanded={details}>
          {details ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box
        display="flex"
        alignItems={details ? 'flex-start' : 'center'}
        gap={GROUP_GAP}
        p={4}
        {...rowProps}
      >
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
            <Box flexShrink={0}>
              <Typography variant="body2" component="div">
                <TimeLabel date={commit.committedAt} />
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap={true}>
                by {commit.author}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              component="div"
              flex="1 1 0"
              minWidth={0}
              whiteSpace="pre-line"
              sx={MESSAGE_CLAMP}
            >
              {compactMessage(commit.message)}
            </Typography>
            {tags.length ? (
              <Stack direction="row" spacing={2} alignItems="center" flexShrink={0}>
                {version ? (
                  <Typography variant="body2" color="text.secondary">
                    Version
                  </Typography>
                ) : null}
                <Tags tags={tags} />
              </Stack>
            ) : null}
            {tags.length ? <Divider orientation="vertical" flexItem={true} /> : null}
            <Typography variant="body2" component="div" flexShrink={0}>
              <ShaCopy sha={commit.sha} />
            </Typography>
          </Box>
        )}
        {details ? null : <Divider orientation="vertical" flexItem={true} />}
        {actions}
      </Box>
    </Paper>
  );
};

export default CommitMetadata;
