import React from 'react';
import { translate } from 'react-translate';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InterfaceDialog from 'modules/customInterfaces/pages/InterfacesList/components/InterfaceDialog';


const NewInterface = ({ t, onCommit }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        {t('NewInterface')}
      </Button>

      <InterfaceDialog
        open={open}
        onCommit={onCommit}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default translate('InterfacesList')(NewInterface);
