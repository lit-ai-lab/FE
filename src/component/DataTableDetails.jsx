// src/pages/DataTableDetails.jsx
import { useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import PdfViewer from './PdfViewer';

const DataTableDetails = ({ data, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('analysisInfo');
  const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66";
  const fileUrl = `http://10.10.10.12:8000/static/pdfs/${sampleUuid}.pdf`;

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
        {/* PDF 뷰어 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">원문 PDF</h2>
          <PdfViewer fileUrl={fileUrl} />
        </div>

        {/* 분석 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">분석 정보</h2>

          <div className="flex mb-6 space-x-2">
            <TabButton label="분석 & 기본정보" active={activeTab === 'analysisInfo'} onClick={() => setActiveTab('analysisInfo')} />
            <TabButton label="데이터 정보" active={activeTab === 'dataInfo'} onClick={() => setActiveTab('dataInfo')} />
          </div>

          {activeTab === 'analysisInfo' ? (
            <InfoList data={[
              ['기관명', data.inspection_agency],
              ['감사날짜', data.date],
              ['감사사항', data.audit_note],
              ['감사대상', data.related_agency],
              ['감사결과', data.audit_result]
            ]} />
          ) : (
            <InfoList data={[
              ['파일형식', 'PDF'],
              ['파일크기', `${data.file_size} KB`],
              ['등록일', data.registration_date]
            ]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableDetails;

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg ${
      active ? 'bg-slate-800 text-white' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const InfoList = ({ data }) => (
  <div className="space-y-2 text-sm text-slate-700">
    {data.map(([label, value], idx) => (
      <p key={idx}><span className="font-semibold">{label}:</span> {value}</p>
    ))}
  </div>
);

// import { useState } from 'react';
// import PdfViewer from './component/PdfViewer';
// import { ChevronRight} from 'lucide-react';

// const DataTableDetails = ({ data, onNavigate }) => {
//   const [activeTab, setActiveTab] = useState('analysisInfo');
//   const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66";
//   const fileUrl = `http://10.10.10.12:8000/static/pdfs/${sampleUuid}.pdf`;

//   if (!data) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         <p className="mb-4">상세 데이터를 불러올 수 없습니다.</p>
//         <button
//           onClick={() => onNavigate('main')}
//           className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
//         >
//           돌아가기
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* 상단 네비게이션 */}
//       <div className="mb-6">
//         <button
//           onClick={() => onNavigate('main')}
//           className="inline-flex items-center px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
//           목록으로 돌아가기
//         </button>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* PDF 영역 */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-800 mb-4">원문 PDF</h2>
//           <PdfViewer fileUrl={fileUrl} />
//         </div>

//         {/* 분석 정보 */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-800 mb-4">분석 정보</h2>

//           {/* 탭 버튼 */}
//           <div className="flex mb-6 space-x-2">
//             <button
//               onClick={() => setActiveTab('analysisInfo')}
//               className={`px-4 py-2 text-sm font-medium rounded-lg ${
//                 activeTab === 'analysisInfo'
//                   ? 'bg-slate-800 text-white'
//                   : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
//               }`}
//             >
//               분석 & 기본정보
//             </button>
//             <button
//               onClick={() => setActiveTab('dataInfo')}
//               className={`px-4 py-2 text-sm font-medium rounded-lg ${
//                 activeTab === 'dataInfo'
//                   ? 'bg-slate-800 text-white'
//                   : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
//               }`}
//             >
//               데이터 정보
//             </button>
//           </div>

//           {/* 탭 내용 */}
//           {activeTab === 'analysisInfo' ? (
//             <div className="space-y-2 text-sm text-slate-700">
//               <p><span className="font-semibold">기관명:</span> {data.inspection_agency}</p>
//               <p><span className="font-semibold">감사날짜:</span> {data.date}</p>
//               <p><span className="font-semibold">감사사항:</span> {data.audit_note}</p>
//               <p><span className="font-semibold">감사대상:</span> {data.related_agency}</p>
//               <p><span className="font-semibold">감사결과:</span> {data.audit_result}</p>
//             </div>
//           ) : (
//             <div className="space-y-2 text-sm text-slate-700">
//               <p><span className="font-semibold">파일형식:</span> PDF</p>
//               <p><span className="font-semibold">파일크기:</span> {data.file_size} KB</p>
//               <p><span className="font-semibold">등록일:</span> {data.registration_date}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTableDetails;