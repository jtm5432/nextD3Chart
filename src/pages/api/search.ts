import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const csvFilePath = path.join(process.cwd(), '/weblog.csv');
const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

interface CSVRow {
  ip: string;
  timestamp: string;
  data: string;
  
  requestType: string; // GET or POST
}

const parseCSVRow = (row: string): CSVRow => {
  const [ip, timestamp, requestType, ...dataParts] = row.split(' ');

  const data = dataParts.join(' ');
  return { ip, timestamp, data, requestType, };
};

let csvData: CSVRow[] = [];

csvFileContent.split('\n').forEach(row => {
  const parsedRow = parseCSVRow(row);
  csvData.push(parsedRow);
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const page = parseInt(req.query.page as string) || 1;
  const query = req.query.q as string;
  const requestType = req.query.type as string; // GET or POST
  const pageSize = 100;

  let filteredData = csvData;

  if (query) {
    filteredData = filteredData.filter(row => {
      return Object.values(row).some(value => String(value).includes(query));
    });
  }

  if (requestType) { // GET 또는 POST로 필터링
    filteredData = filteredData.filter(row => row.requestType === requestType);
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedData = filteredData.slice(startIndex, endIndex);

  res.status(200).json(pagedData);
}

export default handler;
