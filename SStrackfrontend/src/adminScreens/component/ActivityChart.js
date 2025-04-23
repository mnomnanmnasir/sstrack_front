import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ActivityChart(props) {
    const { reportData } = props;

    const data = {
        labels: reportData?.ReportPercentage?.map((f) => f.description),
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
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom', // Positions legend below the chart
                labels: {
                    boxWidth: 15, // Adjusts size of legend color boxes
                    padding: 10,  // Space between items
                    usePointStyle: true, // Makes legend items circular
                },
            },
        },
        layout: {
            padding: {
                bottom: 50, // Adds space below the chart for the legend
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', maxWidth: '700px', height: '500px', margin: 'auto' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}

export default ActivityChart;
