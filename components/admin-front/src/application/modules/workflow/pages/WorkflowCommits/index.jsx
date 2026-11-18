// PoC (poc/git-version-control): the workflow's git commit history, replacing the
// "Process versions" dialog. Front-end only: rows come from ./mocks/commits.
import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import TagIcon from '@mui/icons-material/LocalOfferOutlined';
import CompareIcon from '@mui/icons-material/CompareArrows';

import { history } from 'store';
import LeftSidebarLayout from 'layouts/LeftSidebar';
import DataTable from 'components/DataTable';
import TimeLabel from 'components/Label/Time';

import mockCommits from './mocks/commits';
import ShaCopy from './components/ShaCopy';
import CommitGraph, { graphWidth } from './components/CommitGraph';
import layoutGraph, { ancestry } from './graph';
import SwitchLabel from './components/SwitchLabel';
import tagLabel from './tagLabel';
import { canCreateVersion, versionTooltip, isRelease } from './versions';
import getMessagePreview from './messagePreview';

// PoC copy is plain English on purpose: the app's English strings live in front-core's
// en-GB.js (theme project territory), so translation keys here would render raw.
const LABELS = {
  title: 'Workflow versions',
  sha: 'SHA',
  message: 'Message',
  committedAt: 'Committed',
  author: 'Author',
  tags: 'Tags',
  actions: 'Actions',
  restore: 'Restore',
  createVersion: 'Create version',
  onlyReleases: 'Releases only',
  compare: 'Compare',
  compareTooltip: 'Compare selected versions',
  compareHint: 'Select two versions to compare'
};

// The commit graph comes first, right after the checkbox: branches as lanes, each commit a
// dot on its lane. Then Committed (date) as the row's human-readable name, Message and Author
// (its own column, so rows stay one line); the SHA is technical, so it sits on the right.
// Message is the only flexible column: it takes the remaining width and is cut to one line
// with an ellipsis (fixedTable layout). Every other column is sized to its content.
const graphColumn = (graph, highlighted) => ({
  id: 'graph',
  name: '',
  width: graphWidth(graph.lanes),
  // The graph is drawn over the whole cell (see CommitGraph), so the cell is its frame.
  sx: { position: 'relative' },
  render: (value, commit) => (
    <CommitGraph
      sha={commit.sha}
      node={graph.nodes.get(commit.sha)}
      lanes={graph.lanes}
      highlighted={highlighted}
    />
  )
});

// The SHA of the table row under the pointer (read off its graph cell), or null.
const rowShaAt = (target) =>
  target
    .closest?.('tbody tr')
    ?.querySelector('[data-commit-sha]')
    ?.getAttribute('data-commit-sha') || null;

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
    // Outlined pills. A version's tooltip also says when and by whom it was created.
    render: (tags, commit) => (
      <Stack direction="row" spacing={1}>
        {(tags || []).map((tag) => (
          <Tooltip key={tag} title={versionTooltip(tag, commit) || ''}>
            <Chip
              size="small"
              variant="outlined"
              label={tagLabel(tag)}
              color={tag === 'current' ? 'primary' : 'default'}
            />
          </Tooltip>
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
    render: (value, commit) => {
      const isCurrent = (commit.tags || []).includes('current');
      return (
        <>
          {canCreateVersion(commit) ? (
            <Tooltip title={LABELS.createVersion}>
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
            <Tooltip title={LABELS.restore}>
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      );
    }
  }
];


// Toolbar, right of search, in two groups split by a divider:
// - View settings: the "Releases only" filter (switch, then its label).
// - Actions: Compare (outlined button, enabled only while exactly two commits are checked).
// There's no Create button: versions are created per row (see the actions column).
const ViewSettings = ({ onlyReleases, onOnlyReleasesChange }) => (
  // mr 0: the toolbar's gap does the spacing, not MUI's default 16px label margin.
  <SwitchLabel
    label={LABELS.onlyReleases}
    checked={onlyReleases}
    onChange={onOnlyReleasesChange}
    sx={{ mr: 0 }}
  />
);

// Gap on each side of the divider, in spacing units (32px).
const TOOLBAR_GROUP_GAP = 8;

// Everything sits in one Box of its own: DataTableToolbar gives each direct non-button child
// a 6px right margin with a selector that outranks local margins, so spacing set on the
// divider itself never applied. Inside the Box only its gap spaces the items. Compare is
// wrapped too, so it's the first child of its box and the theme's buttonGap doesn't add on top.
const CommitsToolbar = ({ onlyReleases, onOnlyReleasesChange, onCompare }) => (
  <Box display="flex" alignItems="center" alignSelf="stretch" gap={TOOLBAR_GROUP_GAP}>
    <ViewSettings onlyReleases={onlyReleases} onOnlyReleasesChange={onOnlyReleasesChange} />
    <Divider orientation="vertical" variant="middle" flexItem={true} />
    <Box display="flex">
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
    </Box>
  </Box>
);

// What the search box matches: the fields shown in the row.
const searchText = (commit) =>
  [commit.sha, commit.message, commit.author, ...(commit.tags || []).map(tagLabel)]
    .join(' ')
    .toUpperCase();

const WorkflowCommitsPage = ({ location, match }) => {
  const { workflowId } = match.params;
  const [rowsSelected, setRowsSelected] = React.useState([]);
  const [onlyReleases, setOnlyReleases] = React.useState(false);
  // Search and paging are kept here rather than in DataTableStated, so the graph can be laid
  // out over exactly the rows that pass the filters, before the list is cut into pages.
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const commits = React.useMemo(() => {
    const query = search.trim().toUpperCase();
    return mockCommits
      .filter((commit) => !onlyReleases || isRelease(commit))
      .filter((commit) => !query || searchText(commit).includes(query));
  }, [onlyReleases, search]);

  const graph = React.useMemo(() => layoutGraph(commits, mockCommits), [commits]);
  // Hovering a row highlights its commit's ancestry in the graph.
  const [hoveredSha, setHoveredSha] = React.useState(null);
  const highlighted = React.useMemo(() => ancestry(graph, hoveredSha), [graph, hoveredSha]);
  const tableColumns = React.useMemo(
    () => [graphColumn(graph, highlighted), ...columns],
    [graph, highlighted]
  );
  const handleMouseOver = (event) => {
    const sha = rowShaAt(event.target);
    if (sha !== hoveredSha) setHoveredSha(sha);
  };

  // Back to the first page whenever the filters change the list.
  React.useEffect(() => setPage(1), [onlyReleases, search, rowsPerPage]);
  const pageRows = commits.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
            row-hover rule only recolours <td>. The first column is the graph now (no text),
            so this only matters if a text column moves first again. Same token as
            DataTableRow's hover rule.
          - Search: compact by default instead of filling the toolbar; it widens while focused
            or holding a query, so it stays comfortable to type in. */}
      <Box
        onMouseOver={handleMouseOver}
        onMouseLeave={() => setHoveredSha(null)}
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
        <DataTable
          panel={true}
          darkTheme={true}
          fixedTable={true}
          checkable={true}
          columns={tableColumns}
          data={pageRows}
          page={page}
          search={search}
          count={commits.length}
          rowsPerPage={rowsPerPage}
          CustomToolbar={renderToolbar}
          rowsSelected={rowsSelected}
          actions={{
            onRowsSelect: setRowsSelected,
            isRowSelectable,
            onChangePage: (index) => setPage(index + 1),
            onSearchChange: setSearch,
            onChangeRowsPerPage: setRowsPerPage
          }}
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
