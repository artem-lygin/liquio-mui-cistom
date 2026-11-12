// PoC (poc/git-version-control): the workflow's git commit history, replacing the
// "Process versions" dialog. Front-end only: rows come from ./mocks/commits.
import React from 'react';
import { Chip, IconButton, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

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
  version: 'Version',
  actions: 'Actions',
  restore: 'Restore'
};

// Message is the only flexible column: it takes the remaining width and is cut to one
// line with an ellipsis (fixedTable layout). Every other column is sized to its content.
const columns = [
  {
    id: 'sha',
    name: LABELS.sha,
    width: 120,
    render: (value) => (
      <Typography variant="inherit" fontFamily="monospace">
        {value}
      </Typography>
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
    id: 'version',
    name: LABELS.version,
    width: 100,
    render: (value) => (value ? <Chip size="small" label={value} /> : null)
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

const WorkflowCommitsPage = ({ location, match }) => {
  const { workflowId } = match.params;
  const [rowsSelected, setRowsSelected] = React.useState([]);

  // Row click target (the commit page) is the next PoC step.
  const handleRowClick = () => {};

  return (
    <LeftSidebarLayout
      location={location}
      title={LABELS.title}
      backButton={`/workflow/${workflowId}`}
    >
      <DataTableStated
        panel={true}
        darkTheme={true}
        fixedTable={true}
        checkable={true}
        columns={columns}
        data={mockCommits}
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
    </LeftSidebarLayout>
  );
};

export default WorkflowCommitsPage;
