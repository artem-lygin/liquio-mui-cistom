import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import SelectAllButton from './components/SelectAllButton';

const DataTableHeader = ({
  columns,
  hiddenColumns,
  checkable,
  sort,
  createSortHandler,
  stickyHeader,
  classes,
  headerCellStyle,
  darkTheme,
  data,
  actions,
  rowsSelected,
  multiple,
  controls
}) => {
  // darkTheme (admin): select-all lives in the header's checkbox column, above the row
  // checkboxes it controls, instead of in the toolbar. See selectAllInHeader in
  // DataTableToolbar, which must stay the same condition.
  const selectAllInHeader =
    darkTheme && checkable && multiple && (controls?.selectAllButton ?? true);
  const selectableData = (data || []).filter(actions?.isRowSelectable || Boolean);

  return (
    <TableHead
      className={classNames({
        [classes.stickyHeader]: stickyHeader
      })}
    >
      <TableRow>
        {checkable ? (
          selectAllInHeader ? (
            // padding="normal": the theme's MuiTableCell padding, so the checkbox lines up with
            // the row checkboxes' own 12px cell padding below.
            <TableCell
              width={64}
              style={headerCellStyle}
              component="th"
              className={classes.cellDark}
            >
              <SelectAllButton
                inHeader={true}
                rowsSelected={rowsSelected}
                selectableData={selectableData}
                onRowsSelect={actions?.onRowsSelectAll || actions?.onRowsSelect}
                darkTheme={darkTheme}
              />
            </TableCell>
          ) : (
            <TableCell
              padding="checkbox"
              width={64}
              style={headerCellStyle}
              component="th"
              aria-hidden="true"
              role="presentation"
              className={classNames({
                [classes.cellDark]: darkTheme
              })}
            />
          )
        ) : null}
        {(columns || [])
          .filter((column) => !hiddenColumns.includes(column.id))
          .map(({ sortable, ...column }, columnKey) => {
            const direction = sort[column.id];

            return (
              <TableCell
                key={columnKey}
                style={headerCellStyle}
                className={classNames({
                  [classes.TableCell]: true,
                  [classes.cellDark]: darkTheme
                })}
                {...column}
                component={column?.name ? 'th' : 'td'}
              >
                {sortable ? (
                  <TableSortLabel
                    active={!!direction}
                    direction={direction}
                    onClick={createSortHandler(column.id)}
                  >
                    {column.name}
                  </TableSortLabel>
                ) : (
                  column.name
                )}
              </TableCell>
            );
          })}
      </TableRow>
    </TableHead>
  );
};

DataTableHeader.propTypes = {
  columns: PropTypes.array,
  hiddenColumns: PropTypes.array,
  checkable: PropTypes.bool,
  sort: PropTypes.object,
  createSortHandler: PropTypes.func,
  classes: PropTypes.object,
  stickyHeader: PropTypes.bool
};

DataTableHeader.defaultProps = {
  columns: [],
  hiddenColumns: [],
  checkable: false,
  sort: {},
  createSortHandler: () => null,
  classes: {},
  stickyHeader: false
};

export default DataTableHeader;
