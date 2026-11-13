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
import AddIcon from '@mui/icons-material/Add';
import CompareIcon from '@mui/icons-material/CompareArrows';

import { history } from 'store';
import LeftSidebarLayout from 'layouts/LeftSidebar';
import DataTableStated from 'components/DataTable/DataTableStated';
import TimeLabel from 'components/Label/Time';

import mockCommits from './mocks/commits';
import ShaCopy from './components/ShaCopy';
import getMessagePreview from './messagePreview';

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
  create: 'Create',
  createCommit: 'Create commit',
  createVersion: 'Create version',
  onlyReleases: 'Only releases',
  compare: 'Compare'
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
      <Typography variant="inherit" component="div" noWrap={true}>
        {getMessagePreview(value)}
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
    render: (value) => <ShaCopy sha={value} />
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

// Toolbar, right of search: Compare (only while exactly two commits are checked), the
// "Only releases" filter, then Create (the row's single contained action, last per the admin
// toolbar convention). Create opens a menu; both options are stubs for now.
const CommitsToolbar = ({ onlyReleases, onOnlyReleasesChange, onCompare }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      {onCompare ? (
        <Button variant="outlined" startIcon={<CompareIcon />} onClick={onCompare}>
          {LABELS.compare}
        </Button>
      ) : null}
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

  const commits = onlyReleases ? mockCommits.filter(isRelease) : mockCommits;

  // Compare takes exactly two commits: once two are checked, the other checkboxes are
  // disabled (and there's no select-all). The older commit becomes the base.
  const canCompare = rowsSelected.length === 2;
  const isRowSelectable = (commit) =>
    rowsSelected.length < 2 || rowsSelected.includes(commit.id);
  const handleCompare = () => {
    const [target, base] = mockCommits.filter((commit) => rowsSelected.includes(commit.id));
    history.push(`/workflow/${workflowId}/commits/compare/${base.sha}/${target.sha}`);
  };

  const renderToolbar = () => (
    <CommitsToolbar
      onlyReleases={onlyReleases}
      onOnlyReleasesChange={setOnlyReleases}
      onCompare={canCompare ? handleCompare : null}
    />
  );

  const handleRowClick = (commit) => history.push(`/workflow/${workflowId}/commits/${commit.sha}`);

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
          columns={columns}
          data={commits}
          CustomToolbar={renderToolbar}
          rowsSelected={rowsSelected}
          actions={{ onRowsSelect: setRowsSelected, isRowSelectable }}
          onRowClick={handleRowClick}
          controls={{
            pagination: true,
            toolbar: true,
            search: true,
            header: true,
            selectAllButton: false,
            refresh: false,
            bottomPagination: true
          }}
        />
      </Box>
    </LeftSidebarLayout>
  );
};

export default WorkflowCommitsPage;
