import React from 'react';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { Button, SvgIcon } from '@mui/material';
import {
  UploadFill as SymbolUpload
} from '@material-symbols-svg/react/rounded/w400';
import downloadBase64Attach from 'helpers/downloadBase64Attach';

const ExportUnits = ({
  t,
  classes,
  rowsSelected,
  actions: { exportUnits },
}) => {
  const exportUnitsAction = async () => {
    const blob = await exportUnits(rowsSelected);

    return downloadBase64Attach(
      {
        fileName: `units-${rowsSelected.join('-')}.bpmn`,
      },
      blob,
    );
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.actionBtn}
      onClick={exportUnitsAction}
      startIcon={<SvgIcon component={SymbolUpload} inheritViewBox={true} />}
    >
      {t('ExportUnits')}
    </Button>
  );
};

ExportUnits.propTypes = {
  actions: PropTypes.object.isRequired,
  rowsSelected: PropTypes.array,
};

ExportUnits.defaultProps = {
  rowsSelected: [],
};

export default translate('UnitsListPage')(ExportUnits);
