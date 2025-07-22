import { useState } from 'react';
import './app.css';
import HomePage from './component/HomePage';
import MainPage from './component/MainPage';
import MapPage from './component/MapPage';
import Filtering from './component/Filtering';
//import DataTable from './component/DataTable';
import DataTableDetails from './component/DataTableDetails';
import PdfViewer from './component/PdfViewer';
//import useWindowSize from './component/useWindowSize';
//import DrillDownDonutChart from './component/DrillDownDonutChart';
import TaskPage from './component/TaskPage';

export default function App(){
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [categoryData, setCategoryData] = useState([]); // 전체 카테고리 + 업무 포함
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedData, setSelectedData] = useState(null); // 상세보기용 데이터

  const [mainPageState, setMainPageState] = useState({
    filters: {
      state: '',
      agency: '',
      type: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: '',
      task: '',
      specialCase: false,
      keyword: '',
    },
    data: [],
    selectedStateId: '',
  });

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'details') setSelectedData(data);
    if (page === 'task') setSelectedCategory(data);
    if (page === 'map') {
    setSelectedRegion(''); // ✅ 항상 전국으로 초기화
    setCategoryData([]); // 이전 지역 데이터도 초기화
  }
  };

  //라우팅
  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
      {currentPage === 'main' && <MainPage
          state={mainPageState}
          setState={setMainPageState}
          onNavigate={navigateTo}
        />}
      {currentPage === 'map' && <MapPage
          selected={selectedRegion}
          setSelected={setSelectedRegion}
          onNavigate={navigateTo}
          setCategoryData={setCategoryData}
          categoryData={categoryData}
        />}
      {currentPage === 'task' && <TaskPage
          selectedRegion={selectedRegion}
          category={selectedCategory}
          data={categoryData}
          onNavigate={navigateTo}
        />}
      {currentPage === 'details' && <DataTableDetails
          data={selectedData}
          onNavigate={navigateTo}
        />}
    </div>
  );
};