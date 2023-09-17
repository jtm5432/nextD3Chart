import React from 'react';
import { useTable, usePagination } from 'react-table';

interface D3TableChartProps {
  data: any[];
  pageIndex: number;
  pageSize: number;
  gotoPage: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  setPageSize: (size: number) => void;
}

const D3TableChart: React.FC<D3TableChartProps> = ({
  data,
  pageIndex,
  pageSize,
  gotoPage,
  previousPage,
  nextPage,
  setPageSize
}) => {
  const columns = React.useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0]).map(key => ({
      Header: key,
      accessor: key
    }));
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex, pageSize }
    },
    usePagination
  );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default D3TableChart;
