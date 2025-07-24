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

  // 막대그래프
  useEffect(() => {
    if (!barChartRef.current || categoryData.length === 0) return;
    const chart = echarts.init(barChartRef.current);

    const option = {
      title: { text: `${regionName} 분야별 감사 건수`, left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: categoryData.map((c) => c.category),
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '건수',
          type: 'bar',
          data: categoryData.map((c) => c.count),
        },
      ],
    };

    chart.setOption(option);
    chart.on('click', (params) => setSelectedCategory(params.name));
    return () => chart.dispose();
  }, [categoryData, regionName]);

  // 파이차트
  useEffect(() => {
    if (!pieChartRef.current) return;
    const chart = echarts.init(pieChartRef.current);

    const option = selectedCategoryObj
      ? {
          title: {
            text: `${selectedCategoryObj.category} 업무 분포`,
            left: 'center',
            top: '5%',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}건 ({d}%)',
          },
          legend: {
            orient: 'vertical',
            right: 20,
            top: 'center',
            data: selectedCategoryObj.tasks.map((t) => t.task),
            itemGap: 12,
          },
          series: [
            {
              name: '업무',
              type: 'pie',
              radius: ['20%', '60%'],
              center: ['30%', '50%'],
              label: { show: false },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              },
              labelLine: { show: false },
              data: selectedCategoryObj.tasks.map((t) => ({
                name: t.task,
                value: t.count,
              })),
            },
          ],
        }
      : {
          title: {
            text: '막대를 클릭하여 업무 분포 확인',
            left: 'center',
            top: 'center',
            textStyle: { fontSize: 16, color: '#999' },
          },
          series: [],
        };

    chart.setOption(option, true);
    return () => chart.dispose();
  }, [selectedCategoryObj]);

  useEffect(() => {
    const resize = () => {
      echarts.getInstanceByDom(barChartRef.current)?.resize();
      echarts.getInstanceByDom(pieChartRef.current)?.resize();
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* 왼쪽: 막대차트 */}
      <div className="w-full lg:w-1/2">
        <div ref={barChartRef} className="w-full h-[400px]" />
      </div>

      {/* 오른쪽: 파이차트 */}
      <div className="w-full lg:w-1/2">
        <div ref={pieChartRef} className="w-full h-[400px]" />
      </div>
    </div>
  );
};

export default BarPieChart;
