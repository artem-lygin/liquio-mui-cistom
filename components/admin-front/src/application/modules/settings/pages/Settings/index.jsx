import React, { Fragment } from 'react';
import { translate } from 'react-translate';
import { Button, Paper, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import LeftSidebarLayout, { Content } from 'layouts/LeftSidebar';

const styles = (theme) => ({
  wrapper: {
    backgroundColor: '#eeeeee',
    marginTop: theme.spacing(5),
  },
  paper: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(5),
  },
});

class Settings extends React.Component {
  renderBody() {
    const { t, classes } = this.props;

    return (
      <Fragment>
        <div className={classes.wrapper}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="h5" component="h3">
              {t('Import')}
            </Typography>
            <Typography component="p">Import description.</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {t('ImportFromFile')}
            </Button>
          </Paper>
        </div>

        <div className={classes.wrapper}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="h5" component="h3">
              {t('Export')}
            </Typography>
            <Typography component="p">Export description.</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {t('Upload')}
            </Button>
          </Paper>
        </div>
      </Fragment>
    );
  }

  render() {
    const { t, title, loading, location } = this.props;

    return (
      <LeftSidebarLayout location={location} title={t(title)} loading={loading}>
        <Content>{this.renderBody()}</Content>
      </LeftSidebarLayout>
    );
  }
}

const styled = withStyles(styles)(Settings);
export default translate('Settings')(styled);
