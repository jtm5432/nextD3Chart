import { useState } from 'react';
import DataContext from '../contexts/DataContext';
import Widget from '../components/Widget';

export async function getStaticProps() {
  let data = [];
  try {
    const response = await fetch(`http://localhost:3000/api/search?q=`);
    data = await response.json();
    console.log('serverdata',data)
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      initialData: data
    },
    revalidate: 1, // 1초마다 regeneration을 수행.
  };
}
interface TestPageProps {
  initialData: any[];
}

const TestPage: React.FC<TestPageProps> = ({ initialData }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [data, setData] = useState<any[]>(initialData);  // 초기값을 ISR로 받아온 데이터로 설정
  //console.log('initialData',initialData)
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?q=${searchTerm}`);
      const result = await response.json();
      if (!Array.isArray(result)) {
        throw new Error("Invalid data format received from server.");
      }
      setData(result);
      console.log('res',result)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <DataContext.Provider value={data}>

    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <Widget component="Table" title="Table Widget" maxWidth="w-3/5" />
      <Widget component="Pie" title="Pie Widget" maxWidth="w-1/5" />

    </div>
    </DataContext.Provider>
  );
};

export default TestPage;
