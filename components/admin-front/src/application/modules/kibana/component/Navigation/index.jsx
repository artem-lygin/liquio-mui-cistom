import React, { useState, useEffect, useMemo } from 'react';
import { translate } from 'react-translate';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NavigationList from 'modules/kibana/component/Navigation/NavigationList';
import NavSubItem from 'layouts/components/Navigator/NavSubItem';
import NavItemContent from 'layouts/components/Navigator/NavItemContent';

const styles = (theme) => ({
  categoryWrapper: {
    display: 'block',
  },
  // Very light separation between sidebar items: palette.divider, the same hairline MUI
  // uses for Divider/list/table lines. The Accordion is rendered `square` (below) so the
  // theme's rounded-Paper border (5% white on all four sides) never reaches it — that rule
  // is more specific than this class and used to replace this bottom line.
  accordionRoot: {
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  detailsRoot: {
    display: 'block',
    padding: '0',
  },
  summaryRoot: {
    minHeight: 'auto !important',
    padding: theme.spacing(4, 4),
    '&:hover': {
      background: theme.navigator.navItem.linkActiveBg,
    },
  },
  summaryContent: {
    margin: 0,
  },
  summaryExpanded: {
    margin: '0 !important',
  },
  summaryExpandIcon: {
    marginRight: 0,
    padding: 0,
    width: 32,
    height: 32,
    '& svg': {
      fill: '#fff',
    },
    '&:hover': {
      backgroundColor: 'gray',
    },
  },
});

const KibanaNavigation = (props) => {
  const { t, classes, icon, id, path } = props;

  const [state, setState] = useState(() => {
    const storage = JSON.parse(localStorage.getItem('Navigator'));
    return storage[id].open;
  });

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('Navigator'));

    localStorage.setItem(
      'Navigator',
      JSON.stringify({ ...storage, [id]: { open: state } }),
    );
  }, [state, id]);

  const handleChange = () => setState((open) => !open);

  const menuItemMemoized = useMemo(() => {
    return { title: 'ReportTemplates', id, path };
  }, [id, path]);

  return (
    <li className={classes.categoryWrapper}>
      <Accordion
        square
        classes={{
          root: classes.accordionRoot,
          rounded: classes.accordionRounded,
        }}
        expanded={state}
        onChange={handleChange}
      >
        <AccordionSummary
          classes={{
            root: classes.summaryRoot,
            content: classes.summaryContent,
            expanded: classes.summaryExpanded,
            expandIcon: classes.summaryExpandIcon,
          }}
          expandIcon={<ExpandMoreIcon alt={t('KibanaReports')} />}
          aria-controls={`panel1a-content-${id}`}
        >
          <NavItemContent t={t} path={path} icon={icon} title="KibanaReports" />
        </AccordionSummary>
        <AccordionDetails
          classes={{
            root: classes.detailsRoot,
          }}
        >
          <NavSubItem t={t} menuItem={menuItemMemoized} />
          <NavigationList />
        </AccordionDetails>
      </Accordion>
    </li>
  );
};

KibanaNavigation.defaultProps = {
  access: {
    userHasUnit: [1000002, 1000000042],
  },
};

const translated = translate('KibanaReports')(KibanaNavigation);

export default withStyles(styles)(translated);
