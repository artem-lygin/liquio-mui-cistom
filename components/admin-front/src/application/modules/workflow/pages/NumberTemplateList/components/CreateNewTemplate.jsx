import React from 'react';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { SchemaFormModal } from 'components/JsonSchema';
import promiseChain from 'helpers/promiseChain';
import AddIcon from '@mui/icons-material/Add';
import ImportTemplate from './Actions/ImportTemplate';
import schema from '../variables/temlateSchema';


const styles = (theme) => ({
  buttonsWrapper: {
    display: 'flex',
    '& button': {
      flex: 1,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
  },
});

const CreateNewTemplate = ({ t, actions, classes }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={classes.buttonsWrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
        >
          {t('CreateNew')}
        </Button>
        <ImportTemplate actions={actions} />
      </div>
      <SchemaFormModal
        title={t('NewTemplate')}
        open={open}
        schema={schema(t)}
        onClose={() => setOpen(false)}
        onChange={(data) =>
          promiseChain([actions.createNumberTemplate, actions.load], data)
        }
      />
    </>
  );
};

CreateNewTemplate.propTypes = {
  t: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
};

const styled = withStyles(styles)(CreateNewTemplate);
const translated = translate('NumberTemplateListPage')(styled);

export default translated;
