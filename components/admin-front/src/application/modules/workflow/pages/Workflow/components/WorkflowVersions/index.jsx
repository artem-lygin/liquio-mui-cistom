import React from 'react';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { history } from 'store';

// PoC (poc/git-version-control): the "Process versions" button opens the git commit history
// page instead of the old WorkflowVersionsDialog (still in this folder, now unused).
const WorkflowVersions = ({ workflowId }) => {
  const t = useTranslate('WorkflowAdminPage');

  return (
    <Tooltip title={t('Versions')}>
      <IconButton onClick={() => history.push(`/workflow/${workflowId}/commits`)} size="large">
        <HistoryIcon />
      </IconButton>
    </Tooltip>
  );
};

export default WorkflowVersions;
