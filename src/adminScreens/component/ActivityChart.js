import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ActivityChart(props) {
    const { reportData } = props
    const data = {
        labels: reportData?.ReportPercentage?.map(f => f.description),
        datasets: [
            {
                label: 'Activity',
                data: reportData?.ReportPercentage?.map((f) => Math.ceil(f.percentage)),
                backgroundColor: [
                    '#DC3912',
                    '#3366CC',
                    '#FF9900',
                    '#109618',
                    '#990099',
                    '#0099C6',
                ],
                borderColor: [
                    '#DC3912',
                    '#3366CC',
                    '#FF9900',
                    '#109618',
                    '#990099',
                    '#0099C6',
                ],
                borderWidth: 1,
                labels: reportData?.ReportPercentage?.map((f) => f.description),
            },
        ],
    };
    return <Doughnut data={data} />;
}

export default ActivityChart;