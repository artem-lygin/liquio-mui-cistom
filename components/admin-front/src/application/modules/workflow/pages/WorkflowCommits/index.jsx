// PoC (poc/git-version-control): the workflow's git commit history, replacing the
// "Process versions" dialog. Front-end only: rows come from ./mocks/commits.
import React from 'react';
import { useTranslate } from 'react-translate';
import { Chip, IconButton, Tooltip, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

import LeftSidebarLayout from 'layouts/LeftSidebar';
import DataTableStated from 'components/DataTable/DataTableStated';
import TimeLabel from 'components/Label/Time';

import mockCommits from './mocks/commits';

// Long messages/author names are cut to one line with an ellipsis (fixedTable layout).
const Truncated = ({ children }) => (
  <Typography variant="inherit" component="div" noWrap={true} title={children}>
    {children}
  </Typography>
);

const WorkflowCommitsPage = ({ location, title, match }) => {
  const t = useTranslate('WorkflowCommitsPage');
  const { workflowId } = match.params;
  const [rowsSelected, setRowsSelected] = React.useState([]);

  const columns = [
    {
      id: 'sha',
      name: t('Sha'),
      width: 160,
      render: (value) => <Typography variant="inherit" fontFamily="monospace">{value}</Typography>
    },
    {
      id: 'message',
      name: t('Message'),
      render: (value) => <Truncated>{value}</Truncated>
    },
    {
      id: 'author',
      name: t('Author'),
      render: (value) => <Truncated>{value}</Truncated>
    },
    {
      id: 'createdAt',
      name: t('Date'),
      width: 200,
      render: (value) => <TimeLabel date={value} />
    },
    {
      id: 'version',
      name: t('Version'),
      width: 160,
      render: (value) => (value ? <Chip size="small" label={value} /> : null)
    },
    {
      id: 'actions',
      name: t('Actions'),
      width: 80,
      align: 'right',
      disableClick: true,
      render: () => (
        <Tooltip title={t('Restore')}>
          <IconButton>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  // Row click target (the commit page) is the next PoC step.
  const handleRowClick = () => {};

  return (
    <LeftSidebarLayout
      location={location}
      title={t(title)}
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
