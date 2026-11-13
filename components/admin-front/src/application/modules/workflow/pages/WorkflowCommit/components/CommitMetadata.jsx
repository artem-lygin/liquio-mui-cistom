// PoC (poc/git-version-control): commit metadata card. One row laid out like a row of the
// commits table: committed date "by <author>", the message (up to two lines), then
// SHA, the version group ("Version" + tags + release comment button) and Restore.
// The release comment button expands the card to show the version's release comment under the
// row; clicking it again hides it. A version with no comment gets the crossed-out icon,
// disabled; a commit that isn't a version has no comment button at all.
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
// Gap between the version tags and the release comment button, in spacing units.
const VERSION_BUTTON_GAP = 5;

const CommitMetadata = ({ commit }) => {
  const [open, setOpen] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');
  const comment = version ? commit.releaseComment : null;
  // Can't restore to the version the workflow already runs.
  const isCurrent = tags.includes('current');
  const toggle = () => setOpen((value) => !value);

  let commentTooltip = 'Version has no comment';
  if (comment) commentTooltip = open ? 'Hide release comment' : 'Show release comment';

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" gap={GROUP_GAP} p={4}>
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
        <Typography variant="body2" component="div" flexShrink={0}>
          <ShaCopy sha={commit.sha} iconStart={true} />
        </Typography>
        <Divider orientation="vertical" flexItem={true} />
        {tags.length ? (
          <>
            {/* Version group: "Version" + tags, then the release comment button (versions
                only), set a bit further apart than the theme's 12px buttonGap. The button's
                span is wrapped in a Box (first child there), so buttonGap doesn't add on top. */}
            <Box display="flex" alignItems="center" gap={VERSION_BUTTON_GAP} flexShrink={0}>
              <Stack direction="row" spacing={2} alignItems="center">
                {version ? (
                  <Typography variant="body2" color="text.secondary">
                    Version
                  </Typography>
                ) : null}
                <Tags tags={tags} />
              </Stack>
              {version ? (
                <Box display="flex">
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
              ) : null}
            </Box>
            <Divider orientation="vertical" flexItem={true} />
          </>
        ) : null}
        {/* Restore, always last on the right, after its own divider. Wrapped so it's the
            first child of its box: the theme's buttonGap would otherwise add a margin on top of
            the row's column gap. */}
        <Box display="flex" flexShrink={0}>
          <Tooltip title={isCurrent ? 'This is the current version' : 'Restore'}>
            {/* span: a disabled button fires no events, so the tooltip needs a wrapper. */}
            <span>
              <IconButton disabled={isCurrent}>
                <HistoryIcon />
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
