// PoC (poc/git-version-control): commit metadata card. One row laid out like a row of the
// commits table: committed date "by <author>", the message (up to two lines), then
// SHA, the version group ("Release" + tags + release comment button) and Restore.
// The release comment button expands the card to show the version's release comment under the
// row; clicking it again hides it. A version with no comment gets the crossed-out icon,
// disabled; a commit that isn't a version has no comment button at all.
import React from 'react';
import { Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import TagIcon from '@mui/icons-material/LocalOfferOutlined';
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined';
import CommentIcon from '@mui/icons-material/CommentOutlined';
import NoCommentIcon from '@mui/icons-material/CommentsDisabledOutlined';

import TimeLabel from 'components/Label/Time';

import ShaCopy from '../../WorkflowCommits/components/ShaCopy';
import tagLabel from '../../WorkflowCommits/tagLabel';
import { canCreateVersion, versionTooltip } from '../../WorkflowCommits/versions';

// Outlined pills, the same style as in the commits table.
const Tags = ({ tags }) => (
  <Stack direction="row" spacing={1}>
    {tags.map((tag) => (
      <Tooltip key={tag} title={versionTooltip(tag) || ''}>
        <Chip
          size="small"
          variant="outlined"
          label={tagLabel(tag)}
          color={tag === 'current' ? 'primary' : 'default'}
        />
      </Tooltip>
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
// Pressed state of the release comment toggle.
const TOGGLE_ON = {
  backgroundColor: 'action.selected',
  '&:hover': { backgroundColor: 'action.selected' }
};

// One commit's row plus its release comment (when open), without a panel around it, so the
// compare page can stack two of them in one panel. Each row expands on its own.
// `newer` (compare page only) marks the newer of the two commits with a filled "Newer" pill
// after the date and author; the older one gets none.
// `aligned` (inside CommitRowGroup): the row joins the group's grid as a subgrid, so every
// column is exactly as wide as in the other rows, and the version column is kept even when
// this commit has no tags.
export const CommitRow = ({ commit, newer = false, aligned = false }) => {
  const [open, setOpen] = React.useState(false);
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');
  const comment = version ? commit.releaseComment : null;
  // The commit the workflow already runs: nothing to restore to.
  const isCurrent = tags.includes('current');
  const toggle = () => setOpen((value) => !value);

  let commentTooltip = 'Version has no comment';
  if (comment) commentTooltip = open ? 'Hide release comment' : 'Show release comment';

  const rowLayout = aligned
    ? { display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }
    : { display: 'flex', gap: GROUP_GAP };
  const fullWidth = aligned ? { gridColumn: '1 / -1' } : undefined;

  return (
    <>
      <Box alignItems="center" p={4} {...rowLayout}>
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
          {newer ? <Chip size="small" label="Newer" color="primary" /> : null}
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
            {/* Version group: "Release" + tags, then the release comment button (versions
                only), set a bit further apart than the theme's 12px buttonGap. The button's
                span is wrapped in a Box (first child there), so buttonGap doesn't add on top. */}
            <Box display="flex" alignItems="center" gap={VERSION_BUTTON_GAP} flexShrink={0}>
              <Stack direction="row" spacing={2} alignItems="center">
                {version ? (
                  <Typography variant="body2" color="text.secondary">
                    Release
                  </Typography>
                ) : null}
                <Tags tags={tags} />
              </Stack>
              {version ? (
                <Box display="flex">
                  <Tooltip title={commentTooltip}>
                    {/* span: a disabled button fires no events, so the tooltip needs a wrapper. */}
                    <span>
                      {/* A toggle: while the comment is open the button stays pressed (primary
                          icon on the theme's "selected" background, also on hover). */}
                      <IconButton
                        onClick={toggle}
                        disabled={!comment}
                        aria-pressed={comment ? open : undefined}
                        color={open ? 'primary' : 'default'}
                        sx={open ? TOGGLE_ON : undefined}
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
        {!tags.length && aligned ? (
          <>
            <Box />
            <Divider orientation="vertical" flexItem={true} />
          </>
        ) : null}
        {/* Create version (only on commits after the latest version; stub), then Restore,
            always last on the right, after its own divider. Wrapped so the first button is the
            first child of its box: the theme's buttonGap would otherwise add a margin on top of
            the row's column gap; between the two buttons it gives the usual 12px. */}
        <Box display="flex" justifyContent="flex-end" flexShrink={0}>
          {canCreateVersion(commit) ? (
            <Tooltip title="Create version">
              <IconButton>
                <TagIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {isCurrent ? (
            // No Restore on the current commit; this invisible copy keeps its slot, so Create
            // version lines up with the other rows.
            <IconButton disabled={true} aria-hidden={true} tabIndex={-1} sx={{ visibility: 'hidden' }}>
              <HistoryIcon />
            </IconButton>
          ) : (
            <Tooltip title="Restore">
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {comment && open ? (
        <>
          <Divider sx={fullWidth} />
          <Box p={4} sx={fullWidth}>
            <Typography variant="body2" color="text.secondary" gutterBottom={true}>
              Release comment · version {version}
            </Typography>
            <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
              {comment}
            </Typography>
          </Box>
        </>
      ) : null}
    </>
  );
};

// Rows of several commits (compare page) as one table: a grid whose columns every row shares
// via subgrid: date + author | divider | message | SHA | divider | version | divider | restore.
// Only the message column flexes; the others are as wide as their widest cell.
const GROUP_COLUMNS = 'auto auto minmax(0, 1fr) auto auto auto auto auto';

export const CommitRowGroup = ({ rows }) => (
  <Box display="grid" gridTemplateColumns={GROUP_COLUMNS} columnGap={GROUP_GAP}>
    {rows.map(({ commit, newer }, index) => (
      <React.Fragment key={commit.sha}>
        {index ? <Divider sx={{ gridColumn: '1 / -1' }} /> : null}
        <CommitRow commit={commit} newer={newer} aligned={true} />
      </React.Fragment>
    ))}
  </Box>
);

// The commit page's metadata card: one commit row in a panel.
const CommitMetadata = ({ commit }) => (
  <Paper elevation={2} sx={{ overflow: 'hidden' }}>
    <CommitRow commit={commit} />
  </Paper>
);

export default CommitMetadata;
