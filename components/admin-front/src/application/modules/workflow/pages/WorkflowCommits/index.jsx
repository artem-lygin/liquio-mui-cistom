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
  versionsOnly: 'Versions only'
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

// Committed (date + author) leads as the row's human-readable name; the SHA is technical,
// so it sits on the right. Message is the only flexible column: it takes the remaining
// width and is cut to one line with an ellipsis (fixedTable layout). Every other column is
// sized to its content.
const columns = [
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
      <Typography variant="inherit" component="div" noWrap={true} title={value}>
        {value}
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

// A version tag is any tag other than 'current' (e.g. '1.2').
const hasVersionTag = (commit) => (commit.tags || []).some((tag) => tag !== 'current');

// Toolbar, right of search: the "Versions only" filter, then Create (the row's single
// contained action, last per the admin toolbar convention). Create opens a menu; both
// options are stubs for now.
const CommitsToolbar = ({ versionsOnly, onVersionsOnlyChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={versionsOnly}
            onChange={(event) => onVersionsOnlyChange(event.target.checked)}
          />
        }
        label={LABELS.versionsOnly}
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
  const [versionsOnly, setVersionsOnly] = React.useState(false);

  const commits = versionsOnly ? mockCommits.filter(hasVersionTag) : mockCommits;

  const renderToolbar = () => (
    <CommitsToolbar versionsOnly={versionsOnly} onVersionsOnlyChange={setVersionsOnly} />
  );

  // Row click target (the commit page) is the next PoC step.
  const handleRowClick = () => {};

  return (
    <LeftSidebarLayout
      location={location}
      title={LABELS.title}
      backButton={`/workflow/${workflowId}`}
    >
      {/* DataTable renders a row's first column as <th scope="row">, but its row-hover rule
          only recolours <td>, so Committed (the primary column) stayed unhighlighted. PoC-local
          fix, same token as DataTableRow's hover rule; the shared component is theme-project
          territory (main). */}
      <Box
        sx={(theme) => ({
          '& tbody tr:hover > th': { color: `${theme.dataTableHoverColor} !important` }
        })}
      >
        <DataTableStated
          panel={true}
          darkTheme={true}
          fixedTable={true}
          checkable={true}
          columns={columns}
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
