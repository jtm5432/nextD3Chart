import React, { useContext, useState, useEffect } from 'react';
import DataContext from '../contexts/DataContext';
import D3TableChart from './D3TableChart';
interface CSVRow {
  ip: string;
  timestamp: string;
  data: string;
  requestType: string; // GET or POST
}

const TableChart: React.FC = () => {
  const data = useContext(DataContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState<CSVRow[]>(data); // 여기서 CSVRow는 원래 파일에서 정의된 인터페이스입니다.

  const fetchTableData = async () => {
    const response = await fetch(`/api/search?page=${pageIndex + 1}&pageSize=${pageSize}`); // API 경로를 맞게 수정하세요.
    const data = await response.json();
    setTableData(data);
  };

  useEffect(() => {
    fetchTableData();
  }, [pageIndex, pageSize]);

  const gotoPage = (page: number) => setPageIndex(page);
  const previousPage = () => setPageIndex(prev => prev - 1);
  const nextPage = () => setPageIndex(prev => prev + 1);

  return (
    <div>
      <D3TableChart 
        data={tableData} 
        pageIndex={pageIndex} 
        pageSize={pageSize}
        gotoPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        setPageSize={setPageSize}
      />
      <div>
        <button onClick={() => gotoPage(0)} disabled={pageIndex === 0}>
          {'<<'}
        </button>
        <button onClick={previousPage} disabled={pageIndex === 0}>
          {'<'}
        </button>
        <span>
          Page {pageIndex + 1}
        </span>
        <button onClick={nextPage} disabled={pageIndex + 1 === Math.ceil(tableData.length / pageSize)}>
          {'>'}
        </button>
        {/* <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}

export default TableChart;
