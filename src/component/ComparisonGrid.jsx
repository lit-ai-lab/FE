import {useEffect, useState} from 'react';
import RegionTaskTable from './RegionTaskTable';

const ComparisonGrid = () => {
    const [regionData, setRegionData] = useState([]);

    useEffect(() => {
        fetch('http://10.10.10.12:8001/api/maps/TOP')
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
                </div>
            </div>
        </div>
    );
};

export default ComparisonGrid;