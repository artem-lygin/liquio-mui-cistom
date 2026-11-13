// PoC (poc/git-version-control): commit metadata card. One row laid out like a row of the
// commits table: committed date "by <author>", the message (up to two lines), then
// "Version" + tags, SHA and actions (Restore, release comment).
// The release comment button expands the card to show the version's release comment under the
// row; clicking it again (or the row) hides it. A commit without a version, or a version with
// no comment, gets the crossed-out icon, disabled.
import React from 'react';
import { Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined';
import CommentIcon from '@mui/icons-material/CommentOutlined';
import NoCommentIcon from '@mui/icons-material/CommentsDisabledOutlined';

import TimeLabel from 'components/Label/Time';

import ShaCopy from '../../WorkflowCommits/components/ShaCopy';

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

// Gap between the row's columns (date, message, tags, SHA, actions), in spacing units:
// wider than the gap inside a group so each group reads as a separate item.
const GROUP_GAP = 8;

const CommitMetadata = ({ commit }) => {
  const [open, setOpen] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');
  const comment = version ? commit.releaseComment : null;
  const toggle = () => setOpen((value) => !value);

  // With a comment, the whole row is a toggle too (hover highlight, Enter/Space). The comment
  // area itself isn't, so its text can be selected.
  const rowProps = comment
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-expanded': open,
        onClick: toggle,
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        },
        sx: {
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'action.hover' },
          '&:focus-visible': { backgroundColor: 'action.focus', outline: 'none' }
        }
      }
    : {};

  let commentTooltip = 'Not a version';
  if (comment) commentTooltip = open ? 'Hide release comment' : 'Show release comment';
  else if (version) commentTooltip = 'Version has no comment';

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" gap={GROUP_GAP} p={4} {...rowProps}>
        {/* Date and author on one line. TimeLabel reserves a min-width for table columns;
            dropped here so "by" follows the date directly. */}
        <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
          <CalendarIcon fontSize="small" color="action" />
          <Typography
            variant="body2"
            component="div"
            noWrap={true}
            sx={{ '& > span:first-of-type': { minWidth: 0 } }}
          >
            <TimeLabel date={commit.committedAt} />{' '}
            <Box component="span" color="text.secondary">
              by {commit.author}
            </Box>
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem={true} />
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
          <>
            <Stack direction="row" spacing={2} alignItems="center" flexShrink={0}>
              {version ? (
                <Typography variant="body2" color="text.secondary">
                  Version
                </Typography>
              ) : null}
              <Tags tags={tags} />
            </Stack>
            <Divider orientation="vertical" flexItem={true} />
          </>
        ) : null}
        <Typography variant="body2" component="div" flexShrink={0}>
          <ShaCopy sha={commit.sha} />
        </Typography>
        <Divider orientation="vertical" flexItem={true} />
        {/* Restore, then the release comment button at the far right. No own spacing: the
            theme's buttonGap puts the gap between them. Clicks here don't reach the row. */}
        <Box
          display="flex"
          alignItems="center"
          flexShrink={0}
          onClick={(event) => event.stopPropagation()}
        >
          <Tooltip title="Restore">
            <IconButton>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={commentTooltip}>
            {/* span: a disabled button fires no events, so the tooltip needs a wrapper. */}
            <span>
              <IconButton
                onClick={toggle}
                disabled={!comment}
                aria-expanded={comment ? open : undefined}
                color={open ? 'primary' : 'default'}
              >
                {comment ? <CommentIcon /> : <NoCommentIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      {comment && open ? (
        <>
          <Divider />
          <Box p={4}>
            <Typography variant="body2" color="text.secondary" gutterBottom={true}>
              Release comment · version {version}
            </Typography>
            <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
              {comment}
            </Typography>
          </Box>
        </>
      ) : null}
    </Paper>
  );
};

export default CommitMetadata;
