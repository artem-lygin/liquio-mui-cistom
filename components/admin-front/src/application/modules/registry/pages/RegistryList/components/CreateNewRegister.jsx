import React from 'react';
import { Button } from '@mui/material';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { SchemaFormModal } from 'components/JsonSchema';
import promiseChain from 'helpers/promiseChain';
import AddIcon from '@mui/icons-material/Add';
import RegisterSelect from './RegisterSelect';
import schema from '../variables/registrySchema';


const CreateNewRegister = ({ t, actions }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        {t('CreateNew')}
      </Button>
      <SchemaFormModal
        open={open}
        schema={schema({ t })}
        title={t('NewRegister')}
        onClose={() => setOpen(false)}
        translateError={t}
        onChange={(data) =>
          promiseChain([actions.createRegister, actions.load], data)
        }
        customControls={{
          RegisterSelect,
        }}
      />
    </>
  );
};

CreateNewRegister.propTypes = {
  t: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
};

export default translate('RegistryListAdminPage')(CreateNewRegister);
