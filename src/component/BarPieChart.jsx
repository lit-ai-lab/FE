// src/components/BarPieChart.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const BarPieChart = ({ regionName, categoryData }) => {
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const selectedCategoryObj = categoryData.find(
        (c) => c.category === selectedCategory
    );

    // ✅ 막대그래프: 분야별 count
    useEffect(() => {
        if (!barChartRef.current || categoryData.length === 0) return;

        const chart = echarts.init(barChartRef.current);

        const barOption = {
        title: {
            text: `${regionName} 분야별 감사 건수`,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: categoryData.map((c) => c.category),
            axisLabel: {
            interval: 0,
            rotate: 30
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            name: '건수',
            type: 'bar',
            data: categoryData.map((c) => c.count)
            }
        ]
        };

        chart.setOption(barOption);

        // ✅ 막대 클릭 → 업무 파이차트 대상 선택
        chart.on('click', (params) => {
        setSelectedCategory(params.name);
        });

        return () => chart.dispose();
    }, [categoryData, regionName]);

    // ✅ 파이차트: 해당 분야의 업무 분포
    useEffect(() => {
        if (!pieChartRef.current) return;

        const chart = echarts.init(pieChartRef.current);

        const pieOption = selectedCategoryObj
        ? {
            title: {
                text: `${selectedCategoryObj.category} 업무 분포`,
                left: 'center',
                top: '5%'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}건 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: selectedCategoryObj.tasks.map((t) => t.task)
            },
            series: [
                {
                name: '업무',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bold'
                    }
                },
                labelLine: { show: false },
                data: selectedCategoryObj.tasks.map((t) => ({
                    name: t.task,
                    value: t.count
                }))
                }
            ]
            }
        : {
            title: {
                text: '막대를 클릭하여 업무 분포 확인',
                left: 'center',
                top: 'center',
                textStyle: {
                fontSize: 16,
                color: '#999'
                }
            },
            series: []
            };

        chart.setOption(pieOption, true);

        return () => chart.dispose();
    }, [selectedCategoryObj]);

    // ✅ 반응형 차트 리사이즈
    useEffect(() => {
        const resize = () => {
        echarts.getInstanceByDom(barChartRef.current)?.resize();
        echarts.getInstanceByDom(pieChartRef.current)?.resize();
        };
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div className="flex flex-col items-center gap-8">
        <div
            ref={barChartRef}
            style={{ width: '800px', height: '400px' }}
        />
        <div
            ref={pieChartRef}
            style={{ width: '500px', height: '400px' }}
        />
        </div>
    );
};

export default BarPieChart;
