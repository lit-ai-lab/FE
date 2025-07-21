// App.jsx
import { useState, useEffect } from 'react';
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

import mapToApiParams from './data/mapToApiParams';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedData, setSelectedData] = useState(null); // 상세보기용 데이터

  // ✅ 페이지 전환 및 데이터 전달 함수
  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    setSelectedData(data); // detail용 row 데이터 저장
  };

  const handleNavigate = (page, category = null) => {
    setCurrentPage(page);
    setSelectedCategory(category);
  };

  const [selected, setSelected] = useState('');

  
  //라우팅
  return (
    <div>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'main' && <MainPage onNavigate={navigateTo} />}
      {currentPage === 'map' && <MapPage onNavigate={handleNavigate} selected={selected} setSelected={setSelected} />}
      {currentPage === 'task' && <TaskPage category={selectedCategory} selected={selected} onNavigate={handleNavigate} />}
      {currentPage === 'details' && <DataTableDetails data={selectedData} onNavigate={navigateTo}/>}
    </div>
  );
};

export default App;

// const regionNameMap = {
//   'Seoul': '서울', 'Incheon': '인천광역시', 'Daejeon': '대전광역시', 'Daegu': '대구광역시',
//   'Gwangju': '광주광역시', 'Ulsan': '울산광역시', 'Busan': '부산광역시', 'Sejong': '세종특별자치시',
//   'Gyeonggi': '경기도', 'Gangwon': '강원도', 'North Chungcheong': '충청북도',
//   'South Chungcheong': '충청남도', 'North Jeolla': '전라북도', 'South Jeolla': '전라남도',
//   'North Gyeongsang': '경상북도', 'South Gyeongsang': '경상남도', 'Jeju': '제주특별자치도',
// };

const HomePage = ({ onNavigate }) => {
  return (
    <div>
      <div>
        <div>감사원</div>
        <p>국가 감사 현황 및 지역별 통계 관리 시스템</p>
      </div>
      <div>
        <div onClick={() => onNavigate('main')}>
          <h2>감사현황</h2>
          <p>자체 감사 현황, 분석 및 상세 내용 확인</p>
        </div>
        <div onClick={() => onNavigate('map')}>
          <h2>지역별 통계</h2>
          <p>지역별 감사 현황 및 통계 분석</p>
        </div>
      </div>
      <div>
        <p>© 대한민국 감사원. 모든 권리 보유.</p>
      </div>
    </div>
  );
};


// MainPage, Filtering, DataTable, DataTableDetails (기존 코드 포함) ...

const MainPage = ({ onNavigate }) => {
  const [filters, setFilters] = useState({
      state: '',  //도시는 조회 시 서버에 함께 전달되어야 하므로 포함
      agency: '',
      type: '',
      startDate: '',//2024-01-01
      endDate: '', //2024-12-31
      category: '',
      task: '',
      specialCase: '', //false
      keyword: '',
    });

  //프론트엔드, 백엔드 매칭 테이블 -> handleSearch()에서 변환해줘야 함
  const mapToApiParams = {
    state: "regionId",
    agency: "agencyId", 
    type: "auditTypeId",
    startDate: "startDate",
    endDate: "endDate",
    category: "categoryId",
    task: "taskId",
    specialCase: "includeSpecial",
    keyword: "keyword"
  };
  //사이드바 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //데이터 상태
  const [data, setData] = useState([]);
  
  //로딩(서버 요청) / 에러(서버 요청 중 에러 메세지 발생) 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //감사실시기관 옵션
  const [agencyOptions, setAgencyOptions] = useState([]);

  const [selectedStateId, setSelectedStateId] = useState('');

  //로직: 1. 지역 선택 > 관련 감사 기관 보여줌
  const handleStateChange = (e) => {
    const selectedId = Number(e.target.value); // 문자열 → 숫자 변환
    setSelectedStateId(selectedId); 

    // 2. 선택된 stateId에 해당하는 stateName 추출
    const stateEntry = zone.find((item) => item.stateId === selectedId);
    const stateName = stateEntry?.stateName || "";

    // 3. filters 상태에 stateName 저장
    setFilters((prev) => ({
      ...prev,
      state: stateName,
      agency: "", // 도시 변경 시 기관 초기화
    }));

    // 4. 해당 stateId에 속한 기관 목록 필터링
    if (!selectedId || !stateName) {
      setAgencyOptions([]); // 아무것도 선택 안 했을 경우 초기화
      return;
    }

    const filteredAgencies = zone
          .filter((item) => item.stateId === selectedId)
          .map((item) => ({
          agencyId: item.agencyId,
          agencyName: item.agencyName,
    }));

    // 5. 기관 옵션 업데이트
    setAgencyOptions(filteredAgencies);
  };

  //기본 데이터 조회 (첫 화면) -> 첫 렌더링 시 한 번만 실행
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("http://10.10.10.12:8001/api/viewer/");
        if (!res.ok) throw new Error("기본 데이터 요청 실패");

        const result = await res.json();
        setData(result);
      } catch (err) {
          setError(err.message || "알 수 없는 오류 발생");
          setData([]);
        } finally {
          setIsLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  //로직: 조회 버튼 클릭 > 필터 조건을 서버에 요청 > 데이터 받기 > DataTable에 전달
  const handleSearch = async () => {  //async/await 사용하는 이유는 비동기 작업(fetch)의 결과(완료되기)를 기다려서 다음 줄을 실행하고 싶을 때. 그냥 비동기 쓰면 순서 꼬임
    try{
      setIsLoading(true);
      setError(null);

      const queryString = Object.entries(filters) //객체를 배열로 바꾸는 함수
        .filter(([_, val]) => val !== "" && val !== null)    //특수사례가 false가 기본값이므로, false는 통과시킴
        .map(([key, val]) => {
          const apiKey = mapToApiParams[key] || key;
          return `${apiKey}=${encodeURIComponent(val)}`;
        })
        .join("&");

      const url = `http://10.10.10.12:8001/api/viewer/${queryString ? "?" + queryString : ""}`;
      //await를 쓰면 Promise가 끝날 때까지 기다림. 순서를 보장함
      const res = await fetch(url);  //서버 요청. queryString이 비어있으면(필터 안 했을 때) 기본 전체 요청(/api/audits)이 되고, 값이 있으면 뒤에 붙음

      if (!res.ok) throw new Error("서버 응답 실패"); //응답코드가 200(성공)이 아니라면 에러 발생시킴. catch 블록으로 자동 이동
            
      //여긴 fetch 끝난 다음에 실행됨
      const result = await res.json();
      setData(result);    //성공한 데이터 저장. JSON 형태로 응답 받으면 data에 저장. DataTable에 props로 전달
    } catch (err){  //서버 요청 실패 시 이쪽으로
        setError(err.message || "알 수 없는 오류 발생");    //에러 메시지 저장
        setData([]);    //이전 데이터 초기화 -> 지금은 아무것도 없다고 보여주기 위함
      } finally {
          setIsLoading(false);    //어떤 결과든 무조건 마지막에 로딩 상태 종료 시킴
      }
  };

  //초기화 버튼 클릭 > 모든 필터 상태 비움 > 서버에 기본 데이터 요청(fetch) 다시 보냄 > DataTable에 전체 데이터 보이게 만듦
  const handleReset = async () => {
    setFilters({
      state: '',
      agency: '',
      type: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: '',
      task: '',
      specialCase: '',  //false ??
      keyword: '',
    });
    setAgencyOptions([]);   //기관 옵션도 초기화 필요

    //전체 데이터 요청
    try{
      setIsLoading(true);
      setError(null);

      const res = await fetch("http://10.10.10.12:8001/api/viewer/");   //기다린다
      if(!res.ok) throw new Error("전체 데이터 요청 실패");

      const result = await res.json();    //또 기다림
      setData(result);    //다 끝난 다음에 실행됨
    } catch (err) {
        setError(err.message || "알 수 없는 오류 발생");
        setData([]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div style={{display: 'flex'}}>
      {/* 사이드바 */}
      <div className={isSidebarOpen ? 'w-72' : 'w-16'}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          메뉴
        </button>
        <button onClick={() => onNavigate('home')}>
          홈
        </button>
        <button onClick={() => onNavigate('map')}>
          통계
        </button>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div style={{flex: 1}}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Filtering 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={handleSearch} 
          onReset={handleReset}
          onStateChange={handleStateChange}   //도시 선택 핸들러
          agencyOptions={agencyOptions}   //기관 드롭다운 옵션
          selectedStateId={selectedStateId}
        />
        <DataTable data = {data} isLoading = {isLoading} error = {error} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

const Filtering = (
  {filters,
  setFilters,
  onSearch,
  onReset,
  onStateChange,
  agencyOptions,
  selectedStateId
  }
) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. 필터 항목 공통 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setFilters((prev) => ({
        ...prev,
        category: value,
        task: '', // 업무 초기화
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const categoryList = Object.keys(catTasks); // 분야 리스트
  const taskList = filters.category ? catTasks[filters.category] : [];

  // stateId 기준으로 고유한 state 목록 생성
  const stateList = zone.reduce((acc, cur) => {
    const exists = acc.find(item => item.stateId === cur.stateId);
      if (!exists) acc.push({ stateId: cur.stateId, stateName: cur.stateName });
    return acc;
    }, []);

  return(
    <div>
      <div>
        <label>검사일:</label>
        <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        <span>~</span>
        <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />

        <label>광역자치단체</label>
          <select value = {selectedStateId} onChange = {onStateChange}>
            <option value="">전체</option>
              {stateList.map((state) => (
                <option key = {state.stateId} value = {state.stateId}>{state.stateName}</option>                
              ))}
          </select>

          {/* 검사실시기관 선택 */}
          <label>감사실시기관</label>
            <select name="agency" value={filters.agency} onChange={handleChange} disabled={!filters.state}>
              <option value="">전체</option>
                {agencyOptions.map((agency) => (
                    <option key={agency.agencyId} value={agency.agencyName}>{agency.agencyName}</option>
                ))}
            </select>
      </div>

      <button onClick={() => setIsFilterOpen(prev => !prev)}>
      {isFilterOpen ? '필터 닫기' : '그 외 필터링'}
      </button>

      {isFilterOpen && (
        <div>
          <label>감사 종류</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">전체</option>
            {inspection.inspection_types.map((is) => (
              <option key={is.id} value={is.name}>{is.name}</option>
            ))}
          </select>

          <label>분야</label>
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">전체</option>
            {categoryList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label>업무</label>
          <select
            name="task"
            value={filters.task}
            onChange={handleChange}
            disabled={!filters.category}
          >
            <option value="">전체</option>
            {taskList.map((task, idx) => (
              <option key={idx} value={task}>{task}</option>
            ))}
          </select>

          <label>특이사례</label>
          <select
            value={filters.specialCase === "" ? "" : String(filters.specialCase)}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({
                ...filters,
                specialCase: val === "" ? "" : val === "true",
              });
            }}
          >
            <option value="">전체</option>
            <option value="false">미포함</option>
            <option value="true">포함</option>
          </select>

          <label>키워드</label>
          <input name="keyword" value={filters.keyword} onChange={handleChange} />
        </div>
      )}

      
      <div>
        <button onClick={onSearch}>조회</button>
        <button onClick={onReset}>초기화</button>
      </div>
    </div>
  );
};

const DataTable = ({data, isLoading, error, onNavigate}) => {
  //에러 처리
  if (error){
    return <div style = {{color: 'red'}}>오류 발생: {error}</div>;
  }
  //로딩 중일 때
  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const handleDetailsClick = async (id) => {
    try {
      const res = await fetch(`http://10.10.10.12:8001/api/viewer/${id}`);
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
    { field: 'inspection_agency', headerName: '감사실시기관', width: 130 },
    { field: 'disposition_request', headerName: '처분요구명', width: 130 },
    { field: 'related_agency', headerName: '관련기관', width: 150 },
    { field: 'audit_result', headerName: '감사결과', width: 100 },
    { field: 'category', headerName: '분야', width: 100 },
    { field: 'task', headerName: '업무', width: 120 },
    { field: 'summary', headerName: '요약', width: 200 },
    { 
      field: 'special_case', 
      headerName: '특이사례', 
      width: 100,
      renderCell: (params) => (
        <span>{params.value === true ? '🟢' : ''}</span>
      )
    },
    {
      field: 'details',
      headerName: '내용분석',
      width: 120,
      renderCell: (params) => (
        <button onClick={() => handleDetailsClick(params.row.id)}>
          상세보기
        </button>
      )
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

const MapPage = ({ selected, setSelected, onNavigate }) => {

  const regionNameMap = {
  'Seoul': '서울특별시', 'Incheon': '인천광역시', 'Daejeon': '대전광역시', 'Daegu': '대구광역시',
  'Gwangju': '광주광역시', 'Ulsan': '울산광역시', 'Busan': '부산광역시', 'Sejong': '세종특별자치시',
  'Gyeonggi': '경기도', 'Gangwon': '강원도', 'North Chungcheong': '충청북도',
  'South Chungcheong': '충청남도', 'North Jeolla': '전라북도', 'South Jeolla': '전라남도',
  'North Gyeongsang': '경상북도', 'South Gyeongsang': '경상남도', 'Jeju': '제주특별자치도',
};

  //const [selected, setSelected] = useState('');
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cityList = Object.keys(regionNameMap);

  const fetchCategory = async (regionName = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const query = regionName ? `?region=${encodeURIComponent(regionName)}` : '';
      const res = await fetch(`http://10.10.10.12:8001/api/maps/overview/${query}`);
      if (!res.ok) throw new Error("데이터 요청 실패");
      const result = await res.json();
      setCategory(result.top10_categories || []);
    } catch (err) {
      setError(err.message);
      setCategory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategory(); }, []);

  const onLocationClick = (event) => {
    const region = event.target.getAttribute('name');
    setSelected(region);
    fetchCategory(regionNameMap[region]);
  };

  const handleCitySelect = (engName) => {
    setSelected(engName);
    fetchCategory(regionNameMap[engName]);
  };

  const handleNationwide = () => {
    setSelected('');
    fetchCategory();
  };

  return (
    <div style={{ padding: '24px' }}>
      <button onClick={() => onNavigate('home')}>X</button>
      <h2>{selected ? `${regionNameMap[selected] || selected} 선택됨` : '전국 통계'}</h2>
      <SVGMap
        map={southKorea}
        onLocationClick={onLocationClick}
        locationClassName={(location) =>
          location.name === selected ? 'svg-map__location svg-map__location--selected' : 'svg-map__location'
        }
      />
      <style>{`.svg-map__location { fill: #cbd5e1; stroke: #fff; } .svg-map__location:hover { fill: #94a3b8; } .svg-map__location--selected { fill: #2563eb; }`}</style>

      <div>
        <h3>도시 선택</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button onClick={handleNationwide} style={{ backgroundColor: selected === '' ? '#2563eb' : '#f1f5f9' }}>전국</button>
          {cityList.map((engName) => (
            <button key={engName} onClick={() => handleCitySelect(engName)}>{regionNameMap[engName]}</button>
          ))}
        </div>
      </div>

      <div>
        <h2>분야 통계</h2>
        {isLoading && <p>불러오는 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && !error && category.length === 0 && <p>데이터 없음</p>}
        {!isLoading && !error && category.map(cat => (
          <div key={cat.id}>
            <p>{cat.category} ({cat.count})</p>
            <button onClick={() => onNavigate('task', cat.category)}>확인</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskPage = ({ selected, category, onNavigate }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

    const regionNameMap = {
  'Seoul': '서울특별시', 'Incheon': '인천광역시', 'Daejeon': '대전광역시', 'Daegu': '대구광역시',
  'Gwangju': '광주광역시', 'Ulsan': '울산광역시', 'Busan': '부산광역시', 'Sejong': '세종특별자치시',
  'Gyeonggi': '경기도', 'Gangwon': '강원도', 'North Chungcheong': '충청북도',
  'South Chungcheong': '충청남도', 'North Jeolla': '전라북도', 'South Jeolla': '전라남도',
  'North Gyeongsang': '경상북도', 'South Gyeongsang': '경상남도', 'Jeju': '제주특별자치도',
};

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!category) return;

      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = 'http://10.10.10.12:8001/api/maps/overview/category_detail/';
        const encodedCategory = encodeURIComponent(category);

        const regionKor = regionNameMap[selected]; // ✅ 영문 → 한글 매핑
        const query = regionKor
          ? `?region=${encodeURIComponent(regionKor)}&category=${encodedCategory}`
          : `?category=${encodedCategory}`;

        const res = await fetch(`${baseUrl}${query}`);
        if (!res.ok) throw new Error("업무 상세 요청 실패");

        const result = await res.json();
        setTasks(result.top10_tasks || []);
      } catch (err) {
        setError(err.message || "알 수 없는 오류");
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [category, selected]);

  return (
    <div style={{ padding: '24px' }}>
      <button onClick={() => onNavigate('map')}>← 돌아가기</button>
      <h2>카테고리: {category}</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>업무 데이터 없음</p>}
      {!isLoading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}><strong>{task.task}</strong>: {task.count}건</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Chart = () => {
//여기에 Ploty 사용 할 거임. 지도와 연동해서
};

const DataTableDetails = ({ data, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('analysisInfo');
  const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66"; //수정
  const fileUrl = `http://10.10.10.12:8001/static/pdfs/${sampleUuid}.pdf`;  //수정

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <p style={{ color: 'red' }}>상세 데이터를 불러올 수 없습니다.</p>
        <button onClick={() => onNavigate('main')}>돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{display: 'flex'}}>
      <button onClick={() => onNavigate('main')}>닫기</button>
      <div style={{ padding: '24px' }}>
        <h1>원문</h1>
        <PdfViewer fileUrl={fileUrl} />
      </div>

      <div>
        <h1>분석</h1>
        <div>
          <button onClick={() => setActiveTab('analysisInfo')}>
            분석&기본정보
          </button>
          <button onClick={() => setActiveTab('dataInfo')}>
            데이터정보
          </button>
        </div>

        <div>
          {activeTab === 'analysisInfo' ? (
            <div>
              <h3>기본 정보</h3>
              <p><strong>기관명:</strong> {data.inspection_agency}</p>
              <p><strong>감사날짜:</strong> {data.date}</p>
              <p><strong>감사사항:</strong> {data.audit_note}</p>
              <p><strong>감사대상:</strong> {data.related_agency}</p>
              <p><strong>감사결과:</strong> {data.audit_result}</p>
            </div>
          ) : (
            <div>
              <h3>문서정보</h3>
              <p>파일형식: pdf</p>
              <p><strong>파일크기:</strong> {data.file_size} KB</p>
              <p><strong>등록일:</strong> {data.registration_date}</p>
            </div>
          )}
        </div>

        {/*<pre>{JSON.stringify(data, null, 2)}</pre>. */}
      </div>
    </div>
    
  );
};


