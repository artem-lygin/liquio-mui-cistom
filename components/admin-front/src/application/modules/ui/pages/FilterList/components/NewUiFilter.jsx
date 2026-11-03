import React from 'react';
import { translate } from 'react-translate';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import UiFilterDialog from 'modules/ui/pages/FilterList/components/UiFilterDialog';


const NewUiFilter = ({ t, onCommit }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        {t('NewUiFilter')}
      </Button>

      <UiFilterDialog open={open} onCommit={onCommit} onClose={() => setOpen(false)} />
    </>
  );
};

export default translate('UIFilterList')(NewUiFilter);
