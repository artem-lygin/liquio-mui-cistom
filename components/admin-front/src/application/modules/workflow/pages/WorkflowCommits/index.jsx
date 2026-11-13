// PoC (poc/git-version-control): the workflow's git commit history, replacing the
// "Process versions" dialog. Front-end only: rows come from ./mocks/commits.
import React from 'react';
import {
  Box,
  Chip,
  Divider,
  FormControlLabel,
  Button,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import TagIcon from '@mui/icons-material/LocalOfferOutlined';
import CompareIcon from '@mui/icons-material/CompareArrows';

import { history } from 'store';
import LeftSidebarLayout from 'layouts/LeftSidebar';
import DataTableStated from 'components/DataTable/DataTableStated';
import TimeLabel from 'components/Label/Time';

import mockCommits from './mocks/commits';
import ShaCopy from './components/ShaCopy';
import tagLabel from './tagLabel';
import { NEXT_VERSION, canCreateVersion, isRelease } from './versions';
import getMessagePreview from './messagePreview';

// PoC copy is plain English on purpose: the app's English strings live in front-core's
// en-GB.js (theme project territory), so translation keys here would render raw.
const LABELS = {
  title: 'Commits',
  sha: 'SHA',
  message: 'Message',
  committedAt: 'Committed',
  author: 'Author',
  tags: 'Tags',
  actions: 'Actions',
  restore: 'Restore',
  restoreCurrent: 'This is the current version',
  createVersion: 'Create version',
  onlyReleases: 'Releases only',
  compare: 'Compare',
  compareTooltip: 'Compare selected commits',
  compareHint: 'Select two commits to compare'
};

// Committed (date) leads as the row's human-readable name, then Message and Author (its
// own column, so rows stay one line); the SHA is technical, so it sits on the right. Message
// is the only flexible column: it takes the remaining width and is cut to one line with an
// ellipsis (fixedTable layout). Every other column is sized to its content.
const columns = [
  {
    id: 'committedAt',
    name: LABELS.committedAt,
    width: 180,
    render: (value) => <TimeLabel date={value} />
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
    id: 'author',
    name: LABELS.author,
    width: 180,
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
    // Git tags: a process version and/or 'current' (what the workflow runs now).
    // Outlined pills.
    render: (tags) => (
      <Stack direction="row" spacing={1}>
        {(tags || []).map((tag) => (
          <Chip
            key={tag}
            size="small"
            variant="outlined"
            label={tagLabel(tag)}
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
    width: 136,
    align: 'right',
    disableClick: true,
    // Create version (only on commits after the latest version), then Restore, always last.
    // The current version can't be restored to: disabled, with the reason in the tooltip
    // (span: a disabled button fires no events, so the tooltip needs a wrapper).
    render: (value, commit) => {
      const isCurrent = (commit.tags || []).includes('current');
      return (
        <>
          {canCreateVersion(commit) ? (
            <Tooltip title={`${LABELS.createVersion} ${NEXT_VERSION}`}>
              <IconButton>
                <TagIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip title={isCurrent ? LABELS.restoreCurrent : LABELS.restore}>
            <span>
              <IconButton disabled={isCurrent}>
                <HistoryIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    }
  }
];


// Toolbar, right of search, in two groups split by a divider:
// - View settings: the "Releases only" filter (label left of its switch).
// - Actions: Compare (outlined button, enabled only while exactly two commits are checked).
// There's no Create button: versions are created per row (see the actions column).
const ViewSettings = ({ onlyReleases, onOnlyReleasesChange }) => (
  // mr 0: MUI gives a start-placed label a -11px right margin (to pull the switch flush with
  // the edge), which left the switch almost touching the divider after it.
  <FormControlLabel
    sx={{ mr: 0 }}
    labelPlacement="start"
    control={
      <Switch
        size="small"
        checked={onlyReleases}
        onChange={(event) => onOnlyReleasesChange(event.target.checked)}
      />
    }
    label={LABELS.onlyReleases}
  />
);

const CommitsToolbar = ({ onlyReleases, onOnlyReleasesChange, onCompare }) => (
  <>
    <ViewSettings onlyReleases={onlyReleases} onOnlyReleasesChange={onOnlyReleasesChange} />
    <Divider orientation="vertical" variant="middle" flexItem={true} sx={{ mx: 4 }} />
    <Tooltip title={onCompare ? LABELS.compareTooltip : LABELS.compareHint}>
      {/* span: a disabled button fires no events, so the tooltip needs a wrapper. */}
      <span>
        <Button
          variant="outlined"
          startIcon={<CompareIcon />}
          disabled={!onCompare}
          onClick={onCompare || undefined}
        >
          {LABELS.compare}
        </Button>
      </span>
    </Tooltip>
  </>
);

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
