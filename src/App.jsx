// App.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Calendar, FileText, Download, Map, BarChart3, Eye, Filter,
  Home, Building, ChevronRight, Search, X, Menu, Shield,
  TrendingUp, Users, Clock
} from 'lucide-react';
import { SVGMap } from 'react-svg-map';
import 'react-svg-map/lib/index.css';
import southKorea from '@svg-maps/south-korea';

import zone from '../src/data/state_agency.json';
import inspection from '../src/data/inspection_type.json';
import catTasks from '../src/data/category_tasks.json';
import PdfViewer from './component/PdfViewer';
import './app.css';

import Plotly from 'plotly.js-dist-min';

const regionNameMap = {
  'Seoul': '서울특별시', 'Incheon': '인천광역시', 'Daejeon': '대전광역시', 'Daegu': '대구광역시',
  'Gwangju': '광주광역시', 'Ulsan': '울산광역시', 'Busan': '부산광역시', 'Sejong': '세종특별자치시',
  'Gyeonggi': '경기도', 'Gangwon': '강원특별자치도', 'North Chungcheong': '충청북도',
  'South Chungcheong': '충청남도', 'North Jeolla': '전북특별자치도', 'South Jeolla': '전라남도',
  'North Gyeongsang': '경상북도', 'South Gyeongsang': '경상남도', 'Jeju': '제주특별자치도',
};

const App = () => {
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

export default App;

const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* 헤더 네비게이션 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-slate-800" />
              <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
            </div>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>대한민국 감사원</span>
              <span>|</span>
              <span>Board of Audit and Inspection</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-6xl w-full">
          {/* 헤더 섹션 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800 rounded-xl mb-8">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-6 tracking-tight">
              자체감사결과 통합분석시스템
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-2">
              Board of Audit and Inspection
            </p>
            <p className="text-lg text-slate-500">
              감사 현황 및 통계 분석 시스템
            </p>
            <div className="w-32 h-1 bg-slate-800 mx-auto mt-8 rounded-full"></div>
          </div>
          
          {/* 통계 카드 */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-10 h-10 text-slate-700" />
                <span className="text-3xl font-bold text-slate-800">25,274</span>
              </div>
              <p className="text-sm text-slate-600 font-semibold">총 감사 건수</p>
              <p className="text-xs text-slate-500 mt-1">전년 대비 00% 증가</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Building className="w-10 h-10 text-slate-700" />
                <span className="text-3xl font-bold text-slate-800">181</span>
              </div>
              <p className="text-sm text-slate-600 font-semibold">감사 기관</p>
              <p className="text-xs text-slate-500 mt-1">지자체</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-slate-700" />
                <span className="text-3xl font-bold text-slate-800">66.3%</span>
              </div>
              <p className="text-sm text-slate-600 font-semibold">완료율</p>
              <p className="text-xs text-slate-500 mt-1">보고서 요약 완료율</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-10 h-10 text-slate-700" />
                <span className="text-3xl font-bold text-slate-800">4,797</span>
              </div>
              <p className="text-sm text-slate-600 font-semibold">월 평균</p>
              <p className="text-xs text-slate-500 mt-1">전체 월 평균 감사건수</p>
            </div>
          </div>
          
          {/* 메인 네비게이션 카드 */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 cursor-pointer group border border-gray-200"
              onClick={() => onNavigate('main')}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-slate-700 transition-colors">
                감사현황 조회
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                감사 데이터 검색, 조회 및 상세 분석
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                최근 업데이트: 2시간 전
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 cursor-pointer group border border-gray-200"
              onClick={() => onNavigate('map')}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-slate-700 transition-colors">
                지역별 통계
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                지역별 감사 현황 및 통계 분석
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                17개 시도 데이터 연동
              </div>
            </div>
          </div>

          {/* 하단 정보 */}
          <div className="text-center text-slate-500 border-t border-gray-200 pt-8">
            <p className="text-sm mb-2">© 2024 대한민국 감사원. All Rights Reserved.</p>
            <p className="text-xs">서울특별시 종로구 북촌로 112 (삼청동) | 대표전화: 02-2011-9114</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToApiParams = {
  state: 'regionId',
  agency: 'agencyId',
  type: 'auditTypeId',
  category: 'categoryId',
  task: 'taskId',
  keyword: 'keyword',
  specialCase: 'includeSpecial',
  startDate: 'startDate',
  endDate: 'endDate'
};


const MainPage = ({ state, setState, onNavigate }) => {
  const { filters, data, selectedStateId } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const agencyOptions = useMemo(() => {
    if (!selectedStateId) return [];
    return zone
      .filter((item) => item.stateId === selectedStateId)
      .map((item) => ({ agencyId: item.agencyId, agencyName: item.agencyName }));
  }, [selectedStateId]);

  const handleStateChange = (e) => {
    const id = Number(e.target.value);
    const stateName = zone.find((z) => z.stateId === id)?.stateName || '';
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, state: stateName, agency: '' },
      selectedStateId: id,
    }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ 로그 추가
    console.log("📌 filters 상태 확인:", filters);

      const queryString = Object.entries(filters)
      .filter(([_, val]) => val !== '' && val !== null)
      .map(([key, val]) => `${mapToApiParams[key] || key}=${encodeURIComponent(val)}`)
      .join("&");
      console.log('[DEBUG] 생성된 queryString: ', queryString);

      const url = `http://localhost:8000/api/viewer/${queryString ? '?' + queryString : ''}`;
      // const url = `http://10.10.10.12:8000/api/viewer/${queryString ? '?' + queryString : ''}`;
      console.log('[DEBUG] 생성된 filters: ', filters);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("조회 실패");

      const result = await res.json();
      setState((prev) => ({ ...prev, data: result }));
    } catch (err) {
      setError(err.message || "에러 발생");
      setState((prev) => ({ ...prev, data: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setState({
      filters: {
        state: '', agency: '', type: '', startDate: '2024-01-01',
        endDate: '2024-12-31', category: '', task: '',
        specialCase: 'false', keyword: '',
      },
      selectedStateId: '',
      data: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 네비게이션 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-slate-800" />
              <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                홈
              </button>
              <button 
                onClick={() => onNavigate('map')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Map className="w-4 h-4 mr-2" />
                지역별 통계
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">감사현황 조회</h1>
          <p className="text-slate-600">감사 데이터를 검색하고 상세 정보를 확인하세요.</p>
        </div>

        {/* 필터링 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <Filtering
            filters={filters}
            setFilters={(f) => setState((prev) => ({ ...prev, filters: f }))}
            onSearch={handleSearch}
            onReset={handleReset}
            onStateChange={handleStateChange}
            agencyOptions={agencyOptions}
            selectedStateId={selectedStateId}
            catTasks={catTasks}
            inspectionTypes={inspection.inspection_types}
          />
        </div>

        {/* 데이터 테이블 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">검색 결과</h2>
            <p className="text-sm text-slate-600 mt-1">
              총 {data.length}건의 감사 데이터가 조회되었습니다.
            </p>
          </div>
          <DataTable
            data={data}
            isLoading={isLoading}
            error={error}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};

const Filtering = ({
  filters, setFilters,
  onSearch, onReset,
  onStateChange, agencyOptions,
  selectedStateId, catTasks, inspectionTypes
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFilters({
    ...filters,
    [name]: value,
    ...(name === 'category' ? { task: '' } : {}),
    //specialCase: e.target.value
  });
};

  const stateList = useMemo(() => {
    return zone.reduce((acc, cur) => {
      if (!acc.find((s) => s.stateId === cur.stateId)) {
        acc.push({ stateId: cur.stateId, stateName: cur.stateName });
      }
      return acc;
    }, []);
  }, []);

  const taskList = filters.category ? catTasks[filters.category] || [] : [];

  return (
    <div className="p-6">
      {/* 기본 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">검사일 (시작)</label>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">검사일 (종료)</label>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">광역자치단체</label>
          <select 
            value={selectedStateId} 
            onChange={onStateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="">전체</option>
            {stateList.map((state) => (
              <option key={state.stateId} value={state.stateId}>{state.stateName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">감사실시기관</label>
          <select 
            name="agency" 
            value={filters.agency} 
            onChange={handleChange} 
            disabled={!filters.state}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">전체</option>
            {agencyOptions.map((agency) => (
              <option key={agency.agencyId} value={agency.agencyName}>{agency.agencyName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 추가 필터 토글 */}
      <div className="mb-6">
        <button 
          onClick={() => setIsFilterOpen((p) => !p)}
          className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          {isFilterOpen ? '추가 필터 닫기' : '추가 필터 열기'}
        </button>
      </div>

      {/* 추가 필터 */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">감사 종류</label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="">전체</option>
              {inspectionTypes.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">분야</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="">전체</option>
              {Object.keys(catTasks).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">업무</label>
            <select 
              name="task" 
              value={filters.task} 
              onChange={handleChange} 
              disabled={!filters.category}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">전체</option>
              {taskList.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">특이사례</label>
            <select
              name="specialCase"
              value={filters.specialCase}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="">전체</option>
              <option value="false">미포함</option>
              <option value="true">포함</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
            <input 
              name="keyword" 
              value={filters.keyword} 
              onChange={handleChange}
              placeholder="검색할 키워드를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex space-x-4">
        <button 
          onClick={onSearch}
          className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" />
          조회
        </button>
        <button 
          onClick={onReset}
          className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          초기화
        </button>
      </div>
    </div>
  );
};

const DataTable = ({data, isLoading, error, onNavigate}) => {
  //에러 처리
  if (error){
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">오류 발생</div>
        <div className="text-slate-600">{error}</div>
      </div>
    );
  }
  //로딩 중일 때
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
        <div className="text-slate-600">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  const handleDetailsClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/viewer/${id}`);
      // const res = await fetch(`http://10.10.10.12:8000/api/viewer/${id}`);
      if (!res.ok) throw new Error("상세 정보 요청 실패");

      const detailData = await res.json();

      // ✅ 페이지 전환 + 백엔드 데이터 전달
      onNavigate('details', detailData);

    } catch (err) {
      console.error("상세 정보 오류:", err.message);
      alert("상세 정보를 불러오는 데 실패했습니다.");
    }
  };

  //컬럼 정의
  const columns = [
    { 
      field: 'inspection_agency', 
      headerName: '감사실시기관', 
      width: 150,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'disposition_request', 
      headerName: '처분요구명', 
      width: 180,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'related_agency', 
      headerName: '관련기관', 
      width: 150,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'audit_result', 
      headerName: '감사결과', 
      width: 120,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'category', 
      headerName: '분야', 
      width: 100,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'task', 
      headerName: '업무', 
      width: 120,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    { 
      field: 'summary', 
      headerName: '요약', 
      width: 250,
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
      },
      { 
      field: 'special_case', 
      headerName: '특이사례', 
      width: 100,
      renderCell: (params) => (
        <span>{params.value === true ? '🟢' : ''}</span>
      ),
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    },
    {
      field: 'details',
      headerName: '내용분석',
      width: 120,
      renderCell: (params) => (
        <button onClick={() => handleDetailsClick(params.row.id)}>
          상세보기
        </button>
      ),
      headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
    }
  ];

  // 행(row) 정의: 고유 id 필드 필요
  const rows = data.map((item) => ({
    id: item.id, 
    ...item
  }));

  return(
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15]}
        pagination
        loading={isLoading}
      />
    </div>
  );
};

const DrillDownDonutChart = ({ regionName, categoryData }) => {
  const chartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 선택된 분야의 task 목록
  const selectedTasks =
    categoryData.find((c) => c.category === selectedCategory)?.tasks || [];

  // 🟡 Plotly 차트 렌더링
  useEffect(() => {
    if (!chartRef.current || !categoryData || categoryData.length === 0) return;

    const categoryTrace = {
      type: 'pie',
      labels: categoryData.map((cat) => cat.category),
      values: categoryData.map((cat) => cat.count),
      hole: 0.55,
      direction: 'clockwise',
      sort: false,
      textinfo: 'label+percent',
      textposition: 'inside',
      textfont:{
        size: 15,
        color: '#fff',
        family: 'Arial, sans-serif'
      },
      name: '분야',
      pull: categoryData.map((cat) =>
        cat.category === selectedCategory ? 0.1 : 0
      ),
      marker: {
        line: { width: 2, color: '#ffffff' },
        colors: [
          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
          '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
        ]
      },
      hovertemplate: '<b>%{label}</b><br>건수: %{value}건<br>비율: %{percent}<extra></extra>',
      domain: selectedCategory ? { x: [0.15, 0.85], y: [0.15, 0.85] } : { x: [0.1, 0.9], y: [0.1, 0.9] }
    };

    const taskTrace = selectedCategory && selectedTasks.length > 0
      ? {
          type: 'pie',
          labels: selectedTasks.map(t => t.task),
          values: selectedTasks.map(t => t.count),
          hole: 0.75,
          direction: 'clockwise',
          sort: false,
          textinfo: 'none',
          textposition: 'auto',
          textfont:{
            size: 14,
            color: '#fff',
            family: 'Arial, sans-serif'
          },
          name: '업무',
          marker: {
            line: { width: 2, color: '#ffffff' },
            colors: [
              '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
              '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'
            ]
          },
          hovertemplate: '<b>%{label}</b><br>건수: %{value}건<br>비율: %{percent}<extra></extra>',
          domain: { x: [0.1, 0.9], y: [0.1, 0.9] }
        }

      : null;

    const layout = {
      title: {
        text: `${regionName || '전국'} 분야별 감사 현황`,
        x: 0.5,
        font: { size: 20, family: 'Arial, sans-serif', color: '#1f2937' }
      },
      showlegend: false,
      margin: { t: 80, b: 80, l: 80, r: 80 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff',
      annotations: [
        {
          text: selectedCategory 
            ? `<b style="font-size:16px">${selectedCategory}</b><br><span style="font-size:12px;color:#6b7280">클릭하여 업무별 보기</span>` 
            : `<b style="font-size:18px">${regionName || '전국'}</b><br><b style="font-size:18px">감사 현황</b><br><span style="font-size:12px;color:#6b7280">분야를 클릭하세요</span>`,
          font: { size: 14, color: '#374151' },
          showarrow: false,
          x: 0.5,
          y: 0.5,
          xanchor: 'center',
          yanchor: 'middle',
          align: 'center'
        }
      ]
    };

    const traces = taskTrace ? [taskTrace, categoryTrace] : [categoryTrace];

    Plotly.newPlot(chartRef.current, traces, layout, {
      responsive: true,
      displayModeBar: false
    });

    chartRef.current.on('plotly_click', (e) => {
      const label = e.points[0].label;
      const curveNumber = e.points[0].curveNumber;
      const categoryTraceIndex = taskTrace ? 1 : 0;

      if (curveNumber === categoryTraceIndex) {
        setSelectedCategory(label === selectedCategory ? null : label);
      }
    });

  }, [categoryData, selectedCategory, regionName]);

  // 창 크기 대응
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        Plotly.Plots.resize(chartRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{regionName || '지역'} 감사 현황</h2>
        <div className="w-20 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
            <p className="text-slate-600 font-medium">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <div ref={chartRef} className="w-full mx-auto" style={{ height: '500px' }} />
          </div>

          {selectedCategory && (
            <div className="flex justify-center">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                전체 분야로 돌아가기
              </button>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {selectedCategory ? `${selectedCategory} 업무별 현황` : '분야별 현황'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedCategory ? selectedTasks : categoryData).map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded mr-3 flex-shrink-0"
                    style={{
                      backgroundColor: selectedCategory 
                        ? ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'][index % 8]
                        : ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'][index % 10]
                    }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-700 text-sm truncate">
                      {selectedCategory ? item.task : item.category}
                    </div>
                    <div className="text-slate-500 text-xs">{item.count}건</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPage = ({ selected, setSelected, onNavigate, setCategoryData, categoryData }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cityList = Object.keys(regionNameMap);

  const handleFetch = async (korRegion = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const query = korRegion ? `?region=${encodeURIComponent(korRegion)}` : '';
      const res = await fetch(`http://localhost:8000/api/maps/overview/${query}`);
      // const res = await fetch(`http://10.10.10.12:8000/api/maps/overview/${query}`);
      if (!res.ok) throw new Error("데이터 요청 실패");
      const result = await res.json();
      setCategoryData(result.categories || []);
    } catch (err) {
      setError(err.message);
      setCategoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 처음 진입 시 전국 데이터 요청
  useEffect(() => {
    if (selected === '') {
      handleFetch(); // 최초 진입 시 한 번 실행
    }
  }, [selected]);

  const handleRegionClick = (e) => {
    const regionKey = e.target.getAttribute('name');
    const korRegion = regionNameMap[regionKey];
    setSelected(regionKey);
    handleFetch(korRegion);
  };

  // 버튼 클릭 핸들러 (영문 지역명 전달받음)
  const handleCitySelect = (engRegion='') => {
    setSelected(engRegion);
    const korRegion = regionNameMap[engRegion] || '';
    handleFetch(korRegion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 네비게이션 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-slate-800" />
              <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                홈
              </button>
              <button 
                onClick={() => onNavigate('main')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                감사현황 조회
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">지역별 통계</h1>
          <p className="text-slate-600">
            {selected ? `${regionNameMap[selected] || selected}` : '전국'} 감사 현황을 확인하세요.
          </p>
        </div>

        {/* 지도 및 지역 선택 섹션 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* 지도 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">대한민국 지도</h2>
              <div className="relative">
                <SVGMap
                  map={southKorea}
                  onLocationClick={handleRegionClick}
                  locationClassName={(loc) =>
                    loc.name === selected ? 'svg-map__location svg-map__location--selected' : 'svg-map__location'
                  }
                />
              </div>
              <style>{`
                .svg-map__location { 
                  fill: #cbd5e1; 
                  stroke: #fff; 
                  stroke-width: 2; 
                  transition: fill 0.2s;
                  cursor: pointer;
                } 
                .svg-map__location:hover { 
                  fill: #94a3b8; 
                } 
                .svg-map__location--selected { 
                  fill: #1e293b !important; 
                }
              `}</style>
            </div>
          </div>

          {/* 지역 선택 버튼 영역 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">지역 선택</h3>
            <div className="space-y-2">
              {/* 전국 버튼 */}
              <button
                onClick={() => handleCitySelect('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selected === '' 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-gray-50 text-slate-700 hover:bg-gray-100'
                }`}
              >
                전국
              </button>
              {/* 지역 버튼들 */}
              {cityList.map((engName) => (
                <button
                  key={engName}
                  onClick={() => handleCitySelect(engName)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selected === engName 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-gray-50 text-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {regionNameMap[engName]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 분야별 통계 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">분야별 통계</h2>
            <p className="text-sm text-slate-600 mt-1">
              {selected ? regionNameMap[selected] : '전국'} 지역의 분야별 감사 현황입니다.
            </p>
          </div>
          
          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mr-3"></div>
                <span className="text-slate-600">데이터를 불러오는 중...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg font-medium mb-2">오류 발생</div>
                <div className="text-slate-600">{error}</div>
              </div>
            )}
            
            {!isLoading && !error && categoryData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-500 text-lg">해당 지역의 데이터가 없습니다.</div>
              </div>
            )}
            
            {!isLoading && !error && categoryData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.map((cat) => (
                  <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{cat.category}</h3>
                      <span className="text-2xl font-bold text-slate-700">{cat.count}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('task', cat.category)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      상세보기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 차트 섹션 */}
        {selected && categoryData.length > 0 && (
          <DrillDownDonutChart
            regionName={selected === '' ? '전국' : regionNameMap[selected]}
            categoryData={categoryData}
          />
        )}
      </div>
    </div>
  );
};

const TaskPage = ({ selectedRegion, category, data, onNavigate }) => {
  const categoryObj = data.find((cat) => cat.category === category);
  const tasks = categoryObj?.tasks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 네비게이션 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-slate-800" />
              <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                홈
              </button>
              <button 
                onClick={() => onNavigate('map')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Map className="w-4 h-4 mr-2" />
                지역별 통계
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 브레드크럼 및 뒤로가기 */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => onNavigate('map')}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors mr-4"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            돌아가기
          </button>
          <nav className="flex text-sm text-slate-500">
            <span>지역별 통계</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-800 font-medium">
              {regionNameMap[selectedRegion]} - {category}
            </span>
          </nav>
        </div>

        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {regionNameMap[selectedRegion]} - {category}
          </h1>
          <p className="text-slate-600">해당 분야의 업무별 상세 현황입니다.</p>
        </div>

        {/* 업무 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">업무별 현황</h2>
            <p className="text-sm text-slate-600 mt-1">
              총 {tasks.length}개의 업무가 있습니다.
            </p>
          </div>
          
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-500 text-lg mb-2">업무 데이터가 없습니다.</div>
                <p className="text-slate-400">해당 분야에 등록된 업무가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                        {task.task}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-700">{task.count}</div>
                        <div className="text-sm text-slate-500">건</div>
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 통계 요약 */}
        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">통계 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-800">{tasks.length}</div>
                <div className="text-sm text-slate-600">총 업무 수</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-800">
                  {tasks.reduce((sum, task) => sum + task.count, 0)}
                </div>
                <div className="text-sm text-slate-600">총 건수</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-800">
                  {Math.max(...tasks.map(t => t.count))}
                </div>
                <div className="text-sm text-slate-600">최대 건수</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round(tasks.reduce((sum, task) => sum + task.count, 0) / tasks.length)}
                </div>
                <div className="text-sm text-slate-600">평균 건수</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DataTableDetails = ({ data, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('analysisInfo');
  const [extractedTexts, setExtractedTexts] = useState([]);
  const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66";
  const fileUrl = `http://localhost:8000/static/pdfs/${sampleUuid}.pdf`;
  // const fileUrl = `http://10.10.10.12:8000/static/pdfs/${sampleUuid}.pdf`;

  // Callback for when text is extracted from PDF
  const handleTextExtraction = (extractedData) => {
    setExtractedTexts(prev => [...prev, extractedData]);
  };

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="mb-4">상세 데이터를 불러올 수 없습니다.</p>
        <button
          onClick={() => onNavigate('main')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('main')}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          목록으로 돌아가기
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* PDF 영역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">원문 PDF</h2>
          <PdfViewer fileUrl={fileUrl} onExtractText={handleTextExtraction} />
        </div>

        {/* 분석 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">분석 정보</h2>

          {/* 탭 버튼 */}
          <div className="flex mb-6 space-x-2">
            <button
              onClick={() => setActiveTab('analysisInfo')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'analysisInfo'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              분석 & 기본정보
            </button>
            <button
              onClick={() => setActiveTab('dataInfo')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'dataInfo'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              데이터 정보
            </button>
          </div>

          {/* 탭 내용 */}
          {activeTab === 'analysisInfo' ? (
            <div className="space-y-4">
              <div className="space-y-2 text-sm text-slate-700">
                <p><span className="font-semibold">기관명:</span> {data.inspection_agency}</p>
                <p><span className="font-semibold">감사날짜:</span> {data.date}</p>
                <p><span className="font-semibold">감사사항:</span> {data.audit_note}</p>
                <p><span className="font-semibold">감사대상:</span> {data.related_agency}</p>
                <p><span className="font-semibold">감사결과:</span> {data.audit_result}</p>
              </div>
              
              {/* 추출된 중요 내용 섹션 */}
              {extractedTexts.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">추출된 중요 내용</h3>
                  <div className="space-y-3">
                    {extractedTexts.map((item, index) => (
                      <div key={item.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-slate-500">페이지 {item.page} | {item.timestamp}</span>
                          <button
                            onClick={() => setExtractedTexts(prev => prev.filter(t => t.id !== item.id))}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            삭제
                          </button>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold">파일형식:</span> PDF</p>
              <p><span className="font-semibold">파일크기:</span> {data.file_size} KB</p>
              <p><span className="font-semibold">등록일:</span> {data.registration_date}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




