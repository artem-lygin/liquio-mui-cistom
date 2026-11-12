// PoC (poc/git-version-control): the workflow's git commit history, replacing the
// "Process versions" dialog. Front-end only: rows come from ./mocks/commits.
import React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import LeftSidebarLayout from 'layouts/LeftSidebar';
import DataTableStated from 'components/DataTable/DataTableStated';
import TimeLabel from 'components/Label/Time';

import mockCommits from './mocks/commits';

// PoC copy is plain English on purpose: the app's English strings live in front-core's
// en-GB.js (theme project territory), so translation keys here would render raw.
const LABELS = {
  title: 'Commits',
  sha: 'SHA',
  message: 'Message',
  committedAt: 'Committed',
  tags: 'Tags',
  actions: 'Actions',
  restore: 'Restore',
  copySha: 'Copy SHA',
  copied: 'Copied',
  create: 'Create',
  createCommit: 'Create commit',
  createVersion: 'Create version',
  onlyReleases: 'Only releases',
  expand: 'Show details',
  collapse: 'Hide details',
  commitMessage: 'Commit message',
  releaseComment: (version) => `Release ${version} comment`
};

// navigator.clipboard only exists in secure contexts; the dev hosts are plain http, so
// fall back to a hidden textarea + execCommand there.
const copyText = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
};

// SHA with a copy button that appears while the cell is hovered (or the button focused).
const ShaCell = ({ sha }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (event) => {
    event.stopPropagation(); // don't trigger the row click
    copyText(sha).then(() => setCopied(true));
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        '& .copy-sha': { visibility: 'hidden' },
        '&:hover .copy-sha, & .copy-sha:focus-visible': { visibility: 'visible' }
      }}
      onMouseLeave={() => setCopied(false)}
    >
      <Typography variant="inherit" fontFamily="monospace">
        {sha}
      </Typography>
      <Tooltip title={copied ? LABELS.copied : LABELS.copySha}>
        <IconButton className="copy-sha" size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// The table shows only the subject (first line) of a commit message; the full message and
// the release comment can be any length, so they live in the expanded row.
const getSubject = (message) => (message || '').split('\n')[0];

const getReleaseVersion = (commit) => (commit.tags || []).find((tag) => tag !== 'current');

const DetailsSection = ({ title, text }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom={true}>
      {title}
    </Typography>
    {/* Long-form text: capped line length so it stays readable on wide screens. */}
    <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
      {text}
    </Typography>
  </Box>
);

const CommitDetails = ({ commit }) => (
  <Stack spacing={4} py={2}>
    <DetailsSection title={LABELS.commitMessage} text={commit.message} />
    {commit.releaseComment ? (
      <DetailsSection
        title={LABELS.releaseComment(getReleaseVersion(commit))}
        text={commit.releaseComment}
      />
    ) : null}
  </Stack>
);

// An expand toggle comes first. Committed (date + author) leads as the row's human-readable name; the SHA is technical,
// so it sits on the right. Message is the only flexible column: it takes the remaining
// width and is cut to one line with an ellipsis (fixedTable layout). Every other column is
// sized to its content.
const getColumns = ({ expandedRows, onToggleExpand }) => [
  {
    id: 'expand',
    width: 56,
    padding: 'checkbox',
    disableClick: true,
    render: (value, { id }) => {
      const expanded = expandedRows.includes(id);
      return (
        <Tooltip title={expanded ? LABELS.collapse : LABELS.expand}>
          <IconButton aria-expanded={expanded} onClick={() => onToggleExpand(id)}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Tooltip>
      );
    }
  },
  {
    id: 'committedAt',
    name: LABELS.committedAt,
    width: 220,
    render: (value, { author }) => (
      <>
        <TimeLabel date={value} />
        <Typography variant="body2" color="text.secondary" noWrap={true} title={author}>
          by {author}
        </Typography>
      </>
    )
  },
  {
    id: 'message',
    name: LABELS.message,
    render: (value) => (
      <Typography variant="inherit" component="div" noWrap={true}>
        {getSubject(value)}
      </Typography>
    )
  },
  {
    id: 'tags',
    name: LABELS.tags,
    width: 160,
    // Git tags: a process version and/or 'current' (the version the workflow runs now).
    render: (tags) => (
      <Stack direction="row" spacing={1}>
        {(tags || []).map((tag) => (
          <Chip
            key={tag}
            size="small"
            label={tag}
            color={tag === 'current' ? 'primary' : 'default'}
          />
        ))}
      </Stack>
    )
  },
  {
    id: 'sha',
    name: LABELS.sha,
    width: 152,
    render: (value) => <ShaCell sha={value} />
  },
  {
    id: 'actions',
    name: LABELS.actions,
    width: 88,
    align: 'right',
    disableClick: true,
    render: () => (
      <Tooltip title={LABELS.restore}>
        <IconButton>
          <HistoryIcon />
        </IconButton>
      </Tooltip>
    )
  }
];

// A release is a commit with a version tag, i.e. any tag other than 'current' (e.g. '1.2').
const isRelease = (commit) => (commit.tags || []).some((tag) => tag !== 'current');

// Toolbar, right of search: the "Only releases" filter, then Create (the row's single
// contained action, last per the admin toolbar convention). Create opens a menu; both
// options are stubs for now.
const CommitsToolbar = ({ onlyReleases, onOnlyReleasesChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={onlyReleases}
            onChange={(event) => onOnlyReleasesChange(event.target.checked)}
          />
        }
        label={LABELS.onlyReleases}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
      >
        {LABELS.create}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={close}>{LABELS.createCommit}</MenuItem>
        <MenuItem onClick={close}>{LABELS.createVersion}</MenuItem>
      </Menu>
    </>
  );
};

const WorkflowCommitsPage = ({ location, match }) => {
  const { workflowId } = match.params;
  const [rowsSelected, setRowsSelected] = React.useState([]);
  const [onlyReleases, setOnlyReleases] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState([]);

  const onToggleExpand = (id) =>
    setExpandedRows((rows) =>
      rows.includes(id) ? rows.filter((rowId) => rowId !== id) : [...rows, id]
    );

  const commits = onlyReleases ? mockCommits.filter(isRelease) : mockCommits;

  const renderToolbar = () => (
    <CommitsToolbar onlyReleases={onlyReleases} onOnlyReleasesChange={setOnlyReleases} />
  );

  // Row click target (the commit page) is the next PoC step.
  const handleRowClick = () => {};

  return (
    <LeftSidebarLayout
      location={location}
      title={LABELS.title}
      backButton={`/workflow/${workflowId}`}
    >
      {/* PoC-local overrides of the shared DataTable (the component itself is theme-project
          territory, on main):
          - Row hover: DataTable renders a row's first column as <th scope="row">, but its
            row-hover rule only recolours <td>, so Committed (the primary column) stayed
            unhighlighted. Same token as DataTableRow's hover rule.
          - Search: compact by default instead of filling the toolbar; it widens while focused
            or holding a query, so it stays comfortable to type in. */}
      <Box
        sx={(theme) => ({
          '& tbody tr:hover > th': { color: `${theme.dataTableHoverColor} !important` },
          '& .MuiToolbar-root > div:has(> .MuiInputBase-root)': {
            flex: '0 0 auto',
            width: theme.spacing(60),
            transition: theme.transitions.create('width'),
            '&:focus-within, &:has(input:not(:placeholder-shown))': {
              width: theme.spacing(100)
            }
          }
        })}
      >
        <DataTableStated
          panel={true}
          darkTheme={true}
          fixedTable={true}
          checkable={true}
          columns={getColumns({ expandedRows, onToggleExpand })}
          expandedRows={expandedRows}
          renderExpandedRow={(commit) => <CommitDetails commit={commit} />}
          expandedRowOffset={1}
          searchIcon={true}
          data={commits}
          CustomToolbar={renderToolbar}
          rowsSelected={rowsSelected}
          actions={{ onRowsSelect: setRowsSelected }}
          onRowClick={handleRowClick}
          controls={{
            pagination: true,
            toolbar: true,
            search: true,
            header: true,
            refresh: false,
            bottomPagination: true
          }}
        />
      </Box>
    </LeftSidebarLayout>
  );
};

export default WorkflowCommitsPage;
