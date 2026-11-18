import React, { useState, useEffect } from 'react';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { NavLink } from 'react-router-dom';

import NavItemContent from 'layouts/components/Navigator/NavItemContent';
import NavSubItem from 'layouts/components/Navigator/NavSubItem';

const styles = (theme) => ({
  categoryWrapper: {
    display: 'block',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    '& > div': {
      padding: theme.spacing(5, 4),
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        background: theme.navigator.navItem.linkActiveBg,
      },
    },
    '&.active': {
      '& span': {
        color: theme.navigator.navItem.linkActiveColor,
      },
      '& > div': {
        background: theme.navigator.navItem.linkActiveBg,
      },
      '& svg': {
        fill: theme.navigator.navItem.linkActiveColor,
      },
    },
  },
  emptyChildren: {
    display: 'none',
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
    padding: theme.spacing(4),
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

const NavItem = (props) => {
  const { t, classes, id, path, icon, title, handleDrawerToggle, childs } =
    props;

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

  const handleChange = () => {
    setState((open) => !open);
  };

  return (
    <li className={classes.categoryWrapper}>
      {childs && Array.isArray(childs) && childs.length ? (
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
            aria-controls={`panel1a-content-${id}`}
          >
            <NavItemContent
              t={t}
              path={path}
              icon={icon}
              title={title}
              id={id}
            />
          </AccordionSummary>
          <AccordionDetails
            classes={{
              root: classes.detailsRoot,
            }}
          >
            {childs.map((child, childKey) => (
              <NavSubItem
                key={childKey}
                menuItem={child}
                t={t}
                childItem={true}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ) : (
        <NavLink
          exact={true}
          to={path || ''}
          onClick={handleDrawerToggle}
          activeClassName="active"
          className={classes.navLink}
          id={id}
        >
          <NavItemContent t={t} path={path} icon={icon} title={title} id={id} />
        </NavLink>
      )}
    </li>
  );
};

NavItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styled = withStyles(styles)(NavItem);

export default translate('Navigator')(styled);
