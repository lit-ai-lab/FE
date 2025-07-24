import {useEffect, useState} from 'react';
import RegionTaskTable from './RegionTaskTable';

// const sampleData = [
//     {
//         "region": "서울특별시",
//         "tasks": [
//         { "rank": 1, "name": "계약" },
//         { "rank": 2, "name": "세입(지방세)" },
//         { "rank": 3, "name": "복무" },
//         { "rank": 4, "name": "계약" },
//         { "rank": 5, "name": "계약" },
//         { "rank": 6, "name": "세입(지방세)" },
//         { "rank": 7, "name": "복무" },
//         { "rank": 8, "name": "계약" },
//         { "rank": 9, "name": "복무" },
//         { "rank": 10, "name": "계약" },
//         ]
//     },
//     {
//         "region": "부산광역시",
//         "tasks": [
//         { "rank": 1, "name": "계약" },
//         { "rank": 2, "name": "세입(지방세)" },
//         { "rank": 3, "name": "복무" },
//         { "rank": 4, "name": "계약" },
//         { "rank": 5, "name": "계약" },
//         { "rank": 6, "name": "세입(지방세)" },
//         { "rank": 7, "name": "복무" },
//         { "rank": 8, "name": "계약" },
//         { "rank": 9, "name": "복무" },
//         { "rank": 10, "name": "계약" },
//         ]
//     },
//     {
//         "region": "대구광역시",
//         "tasks": [
//         { "rank": 1, "name": "계약" },
//         { "rank": 2, "name": "세입(지방세)" },
//         { "rank": 3, "name": "복무" },
//         { "rank": 4, "name": "계약" },
//         { "rank": 5, "name": "계약" },
//         { "rank": 6, "name": "세입(지방세)" },
//         { "rank": 7, "name": "복무" },
//         { "rank": 8, "name": "계약" },
//         { "rank": 9, "name": "복무" },
//         { "rank": 10, "name": "계약" },
//         ]
//     },
//     {
//         "region": "인천광역시",
//         "tasks": [
//         { "rank": 1, "name": "계약" },
//         { "rank": 2, "name": "세입(지방세)" },
//         { "rank": 3, "name": "복무" },
//         { "rank": 4, "name": "계약" },
//         { "rank": 5, "name": "계약" },
//         { "rank": 6, "name": "세입(지방세)" },
//         { "rank": 7, "name": "복무" },
//         { "rank": 8, "name": "계약" },
//         { "rank": 9, "name": "복무" },
//         { "rank": 10, "name": "계약" },
//         ]
//     },
//     {
//         "region": "광주광역시",
//         "tasks": [
//         { "rank": 1, "name": "계약" },
//         { "rank": 2, "name": "세입(지방세)" },
//         { "rank": 3, "name": "복무" },
//         { "rank": 4, "name": "계약" },
//         { "rank": 5, "name": "계약" },
//         { "rank": 6, "name": "세입(지방세)" },
//         { "rank": 7, "name": "복무" },
//         { "rank": 8, "name": "계약" },
//         { "rank": 9, "name": "복무" },
//         { "rank": 10, "name": "계약" },
//         ]
//     },
// ];

const ComparisonGrid = () => {
    const [regionData, setRegionData] = useState([]);

    useEffect(() => {
        fetch('http://10.10.10.12:8000/api/maps/TOP')
            .then((res) => res.json())
            .then((data) => setRegionData(data))
            .catch((err) => console.error('데이터 로딩 실패: ', err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    지역별 감사업무 현황
                </h1>
                <p className="text-sm text-gray-600">
                    각 지역별 주요 감사업무 순위를 비교하여 확인할 수 있습니다.
                </p>
                </div>
                
                <div className="grid grid-cols-5 grid-rows-4 gap-4 p-6">
                {regionData.map((region) => (
                    <RegionTaskTable
                    key={region.region}
                    region={region.region}
                    tasks={region.tasks}
                    />
                ))}
                
                {/* 빈 영역이 있으면 플레이스홀더로 채움 */}
                {Array.from({ length: Math.max(0, 20 - regionData.length) }).map((_, idx) => (
                    <div 
                    key={`empty-${idx}`} 
                    className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-48 text-gray-400"
                    >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="text-sm">데이터 없음</div>
                    </div>
                    </div>
                ))}
                </div>
                
                <div className="mt-8 text-center text-xs text-gray-500">
                * 감사업무 순위는 최근 감사 실적을 기준으로 산정됩니다.
                </div>
            </div>
        </div>
    );
};

export default ComparisonGrid;