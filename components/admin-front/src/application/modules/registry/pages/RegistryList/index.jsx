import React from 'react';
import _ from 'lodash/fp';
import { useDispatch } from 'react-redux';
import { history } from 'store';
import { useTranslate } from 'react-translate';
import withStyles from '@mui/styles/withStyles';

import LeftSidebarLayout from 'layouts/LeftSidebar';

import endPoint from 'application/endPoints/registry';
import useTable from 'services/dataTable/useTable';

import DataTable from 'components/DataTable';
import checkAccess from 'helpers/checkAccess';
import { useAuth } from 'hooks/useAuth';
import { getFavorites } from 'actions/favorites';

import asModulePage from 'hooks/asModulePage';
import CreateNewRegister from './components/CreateNewRegister';
import ImportRegistersKeysXLS from './components/ImportRegistersKeysXLS';

import dataTableSettings from './variables/dataTableSettings';
import ImportRegisterKeys from '../KeyList/components/KeyActions/ImportRegisterKeys';


const styles = (theme) => ({
  buttonsWrapper: {
    [theme.breakpoints.down('md')]: {
      marginTop: '10px'
    }
  }
});

const RegistryListPage = (props) => {
  const classes = props?.classes;
  const t = useTranslate('RegistryListAdminPage');
  const dispatch = useDispatch();

  const { info: userInfo, userUnits } = useAuth();

  const tableProps = useTable({ ...endPoint, autoLoad: true });
  const isEditable = checkAccess({ userHasUnit: [1000002] }, userInfo, userUnits);

  const settings = dataTableSettings({
    ...tableProps,
    t,
    readOnly: !isEditable
  });

  React.useEffect(() => {
    getFavorites({
      entity: 'registers'
    })(dispatch);
  }, [dispatch]);

  return (
    <LeftSidebarLayout
      location={props.location}
      title={t(props.title)}
      loading={tableProps.loading}
    >
      <DataTable
        {..._.merge(settings, tableProps)}
        onRowClick={({ id }) => history.push(`/registry/${id}`)}
        CustomToolbar={() =>
          !isEditable ? null : (
            <>
              <CreateNewRegister actions={tableProps.actions} />
              <div className={classes.buttonsWrapper}>
                <ImportRegisterKeys title={props.title} />
                <ImportRegistersKeysXLS actions={tableProps.actions} />
              </div>
            </>
          )
        }
      />
    </LeftSidebarLayout>
  );
};

const styled = withStyles(styles)(RegistryListPage);

export default asModulePage(styled);
