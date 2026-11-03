import React from 'react';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, SvgIcon } from '@mui/material';
import {
  DownloadFill as SymbolDownload
} from '@material-symbols-svg/react/rounded/w400';
import withStyles from '@mui/styles/withStyles';
import { importUnits } from 'application/actions/units';
import unitListControlEndPoint from 'application/endPoints/unitListControl';
import dataTableConnect from 'services/dataTable/connect';
import { addMessage } from 'actions/error';
import Message from 'components/Snackbars/Message';
import ConfirmDialog from 'components/ConfirmDialog';
import parseFile from 'helpers/parseFile';

const styles = () => ({
  actionBtn: {
    marginLeft: 16,
  },
});

const ROWS_PER_PAGE = 1000;

class ImportUnits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirmDialog: false,
      filesInfo: '',
    };
  }

  handleOpenConfirmDialog = () => this.setState({ openConfirmDialog: true });

  handleCloseConfirmDialog = () => this.setState({ openConfirmDialog: false });

  handleUploadClick = () => this.input && this.input.click();

  handleChange = async ({ target }) => {
    this.setState({ target });
    const { actions, unitActions, importActions } = this.props;

    const file = target.files[0];

    parseFile(file, (files) => {
      this.setState({
        filesInfo: files.map(({ id, name }) => `${id} «${name}»`).join(', '),
      });
    });

    const importResult = await importActions.importUnits(file);

    if (importResult instanceof Error) {
      if (importResult.message === 'Unit already exists.') {
        this.handleOpenConfirmDialog();
      } else {
        importActions.addMessage(new Message('InvalidFile', 'error'));
      }
      return;
    }

    const { filesInfo } = this.state;

    importActions.addMessage(
      new Message('ImportUnitsSuccess', 'success', null, {
        filesInfo,
      }),
    );

    unitActions.load();

    actions.onChangeRowsPerPage(ROWS_PER_PAGE, true);
  };

  handleChangeConfirm = async () => {
    const { actions, unitActions, importActions } = this.props;
    const { target } = this.state;

    const importResult = await importActions.importUnits(target.files[0], true);

    if (importResult instanceof Error) {
      importActions.addMessage(new Message('FailImportingUnits', 'error'));
      return;
    }

    this.handleCloseConfirmDialog();

    const { filesInfo } = this.state;

    importActions.addMessage(
      new Message('ImportUnitsSuccess', 'success', null, {
        filesInfo,
      }),
    );

    unitActions.load();

    actions.onChangeRowsPerPage(ROWS_PER_PAGE, true);

    this.setState({ target: {} });
  };

  render() {
    const { t, classes } = this.props;
    const { openConfirmDialog, filesInfo } = this.state;

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          className={classes.actionBtn}
          onClick={this.handleUploadClick}
          startIcon={<SvgIcon component={SymbolDownload} inheritViewBox={true} />}
        >
          {t('ImportUnits')}
        </Button>

        <input
          ref={(ref) => {
            this.input = ref;
          }}
          type="file"
          accept=".bpmn, application/bpmn"
          onChange={this.handleChange}
          hidden={true}
          multiple={false}
        />
        <ConfirmDialog
          fullScreen={false}
          darkTheme={true}
          open={openConfirmDialog}
          title={
            (filesInfo.split(',') || []).length > 1
              ? t('OverwriteUnitsConfirmation')
              : t('OverwriteUnitsConfirmationOne', {
                  filesInfo,
                })
          }
          description={
            (filesInfo.split(',') || []).length > 1
              ? t('OverwriteUnitsConfirmationText', {
                  filesInfo,
                })
              : t('OverwriteUnitsConfirmationTextOne')
          }
          handleClose={this.handleCloseConfirmDialog}
          handleConfirm={this.handleChangeConfirm}
        />
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  importActions: {
    importUnits: bindActionCreators(importUnits, dispatch),
    addMessage: bindActionCreators(addMessage, dispatch),
  },
});

const translated = translate('UnitsListPage')(ImportUnits);
const styled = withStyles(styles)(translated);
const connected = connect(mapStateToProps, mapDispatchToProps)(styled);
export default dataTableConnect(unitListControlEndPoint)(connected);
