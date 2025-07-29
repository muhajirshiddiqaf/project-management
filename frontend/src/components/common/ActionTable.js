import PropTypes from 'prop-types';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useFilters, usePagination, useTable } from 'react-table';

// project import
import { TablePagination } from 'components/third-party/ReactTable';

// ==============================|| ACTION TABLE ||============================== //

function ActionTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data: Array.isArray(data) ? data : [],
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    usePagination
  );

  return (
    <Stack>
      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: 1 }}>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <TableCell key={i} {...column.getHeaderProps([{ className: column.className }])}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination at the bottom */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
      </Box>
    </Stack>
  );
}

ActionTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

export default ActionTable;
