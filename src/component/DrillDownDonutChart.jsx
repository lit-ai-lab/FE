// src/components/DrillDownDonutChart.jsx

import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

const DrillDownDonutChart = ({ chartData }) => {
    const chartRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (!chartData || !chartData.top10_categories || !chartRef.current) return;

    // 이곳에 도넛 그리기 코드 들어갈 예정
    // Step 4에서 구현
    }, [chartData, selectedCategory]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">{chartData?.region || '지역명'}</h2>
            <div ref={chartRef} style={{ width: '100%', maxWidth: '640px', height: '500px' }}></div>
        </div>
    );
};

export default DrillDownDonutChart;
