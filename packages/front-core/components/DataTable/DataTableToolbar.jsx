import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Toolbar, Tooltip, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import LoopIcon from '@mui/icons-material/Loop';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIconOutlined from '@mui/icons-material/ViewModuleOutlined';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import DataTablePagination from 'components/DataTable/DataTablePagination';
import SelectAllButton from './components/SelectAllButton';
import SearchInput from './components/SearchInput';
import CustomizateColumns from './components/CustomizateColumns';

const styles = (theme) => ({
  toolbar: {
    padding: '12px 0',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      paddingTop: 5,
      paddingLeft: 5,
      paddingBottom: 0,
      flexWrap: 'wrap'
    },
    '& > *': {
      marginRight: 6
    },
    '&:last-child': {
      paddingRight: 0,
      marginRight: 0
    },
    ...(theme.tableToolbar || {})
  },
  paginationToolbar: {
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 8
    }
  },
  grow: {
    flexGrow: 1,
    maxWidth: '100%',
    flexBasis: 0
  },
  container: {
    paddingBottom: 18,
    marginLeft: 8,
    marginRight: 8,
    borderBottom: theme?.header?.borderBottom || '1px solid rgba(224, 224, 224, 1)',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    },
    ...(theme.tableToolbarContainer || {})
  },
  // panel (admin list pages): the toolbar is its own card, so the card's edge separates it
  // from the table; no divider line or side inset of its own.
  containerPanel: {
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottom: 'none'
  },
  flexContainer: {
    display: 'flex'
  },
  row: {
    borderBottom: 'none',
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center'
  },
  bottomToolbar: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    borderBottom: 'none',
    paddingBottom: 15,
    ...(theme.bottomToolbar || {})
  },
  refreshIcon: {
    transform: 'rotate(90deg)'
  }
});

const DataTableToolbar = (props) => {
  const {
    t,
    classes,
    className,
    view,
    page,
    count,
    rowsPerPage,
    checkable,
    actions,
    data,
    search,
    filters,
    filterHandlers,
    CustomToolbar,
    CustomToolbarHelper,
    toolbarPosition,
    rowsSelected,
    columns,
    hiddenColumns,
    controls: { selectAllButton = true, ...controls },
    switchView,
    groupBy,
    grouping,
    fullscreen,
    toggleGrouping,
    fullscreenMode,
    toggleFullscreen,
    bottomToolbar,
    darkTheme,
    searchPlaceholder,
    loading,
    updateOnChangeSearch = true,
    OnSelectActions = false,
    multiple,
    panel
  } = props;

  const selectableData = (data || []).filter(actions.isRowSelectable || Boolean);
  const selectedLength = selectableData.length;

  // darkTheme (admin) toolbar order, right of search: icon-only actions (on-select actions,
  // refresh, view/column/fullscreen toggles), then the page's own buttons, whose last one
  // is the row's single Contained action (usually Create). 'start'-positioned toolbars
  // (e.g. File library) keep their own layout.
  const actionsOnRight = darkTheme && toolbarPosition !== 'start';

  // darkTheme (admin): select-all moves into the table header's checkbox column (see
  // DataTableHeader) whenever that header is showing; card view keeps it here.
  const selectAllInHeader = darkTheme && controls.header && view === 'table';

  return (
    <>
      <div
        className={classNames(
          classes.container,
          {
            [classes.containerPanel]: panel,
            [classes.flexContainer]: !controls.pagination || darkTheme,
            [classes.bottomToolbar]: bottomToolbar
          },
          className
        )}
      >
        <Toolbar className={classNames(classes.toolbar, classes.grow)}>
          {checkable && selectAllButton && multiple && !selectAllInHeader ? (
            <SelectAllButton
              rowsSelected={rowsSelected}
              selectableData={selectableData}
              onRowsSelect={actions.onRowsSelectAll || actions.onRowsSelect}
              darkTheme={darkTheme}
            />
          ) : null}

          {OnSelectActions && !actionsOnRight ? (
            <OnSelectActions selectedLength={selectedLength} {...props} />
          ) : null}

          {CustomToolbar && toolbarPosition === 'start' ? (
            <CustomToolbar selectedLength={selectedLength} {...props} />
          ) : null}
          {controls.search ? (
            <SearchInput
              actions={actions}
              search={search}
              filters={filters}
              filterHandlers={filterHandlers}
              darkTheme={darkTheme}
              searchPlaceholder={searchPlaceholder}
              updateOnChangeSearch={updateOnChangeSearch}
            />
          ) : null}
          {OnSelectActions && actionsOnRight ? (
            <OnSelectActions selectedLength={selectedLength} {...props} />
          ) : null}
          {controls.refresh ? (
            <Tooltip title={t('Reload')}>
              <IconButton onClick={(actions || {}).load} size="large">
                <LoopIcon className={classes.refreshIcon} />
              </IconButton>
            </Tooltip>
          ) : null}
          {CustomToolbar && toolbarPosition !== 'start' && !actionsOnRight ? (
            <CustomToolbar selectedLength={selectedLength} {...props} />
          ) : null}
        </Toolbar>

        {/* darkTheme (admin): pagination lives only below the table, never in the toolbar.
            DataTable renders it at the bottom whenever either pagination flag is set. */}
        {controls.pagination && !darkTheme ? (
          <DataTablePagination
            t={t}
            loading={loading}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            count={count}
            onChangePage={actions?.onChangePage}
            onChangeRowsPerPage={actions?.onChangeRowsPerPage}
            withPerPage={false}
            darkTheme={darkTheme}
          />
        ) : null}
        <Toolbar className={classes.toolbar}>
          {controls.switchView ? (
            <Tooltip title={t('SwitchView')}>
              <IconButton onClick={switchView} id="switch-view" size="large">
                {view === 'table' ? <ViewModuleIconOutlined /> : <ViewListIcon />}
              </IconButton>
            </Tooltip>
          ) : null}
          {groupBy ? (
            <Tooltip title={t('ToggleGrouping')}>
              <IconButton onClick={toggleGrouping} id="toggle-grouping" size="large">
                {grouping ? <ViewHeadlineIcon /> : <ViewAgendaIcon />}
              </IconButton>
            </Tooltip>
          ) : null}
          {controls.customizateColumns ? (
            <CustomizateColumns
              darkTheme={darkTheme}
              columns={columns}
              hiddenColumns={hiddenColumns}
              toggleColumnVisible={actions.toggleColumnVisible}
            />
          ) : null}
          {(fullscreenMode || controls.fullscreenMode) && !fullscreen ? (
            <Tooltip title={t('ToggleFullscreen')}>
              <IconButton onClick={toggleFullscreen} id="toggle-fullscreen" size="large">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Toolbar>
        {CustomToolbar && toolbarPosition !== 'start' && actionsOnRight ? (
          <Toolbar className={classes.toolbar}>
            <CustomToolbar selectedLength={selectedLength} {...props} />
          </Toolbar>
        ) : null}
      </div>

      {CustomToolbarHelper ? <CustomToolbarHelper {...props} /> : null}
    </>
  );
};

DataTableToolbar.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  actions: PropTypes.object,
  data: PropTypes.array,
  rowsSelected: PropTypes.array,
  CustomToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  filterHandlers: PropTypes.object,
  toolbarPosition: PropTypes.string,
  bottomToolbar: PropTypes.bool,
  darkTheme: PropTypes.bool,
  OnSelectActions: PropTypes.node
};

DataTableToolbar.defaultProps = {
  t: null,
  classes: null,
  page: 0,
  count: 0,
  rowsPerPage: 10,
  actions: {},
  data: [],
  rowsSelected: [],
  CustomToolbar: null,
  toolbarPosition: 'middle',
  filterHandlers: {},
  bottomToolbar: false,
  darkTheme: false,
  OnSelectActions: null
};

export default withStyles(styles)(DataTableToolbar);
