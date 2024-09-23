// import React from 'react';
// import ReactSpeedometer from "react-d3-speedometer"

// const Speedometer = () => {
//     return (
//         <div>
//             <ReactSpeedometer
//                 width={500}
//                 needleHeightRatio={0.7}
//                 value={777}
//                 currentValueText="Happiness Level"
//                 customSegmentLabels={[
//                     {
//                         text: 'Very Bad',
//                         position: 'INSIDE',
//                         color: '#555',
//                     },
//                     {
//                         text: 'Bad',
//                         position: 'INSIDE',
//                         color: '#555',
//                     },
//                     {
//                         text: 'Ok',
//                         position: 'INSIDE',
//                         color: '#555',
//                         fontSize: '19px',
//                     },
//                     {
//                         text: 'Good',
//                         position: 'INSIDE',
//                         color: '#555',
//                     },
//                     {
//                         text: 'Very Good',
//                         position: 'INSIDE',
//                         color: '#555',
//                     },
//                 ]}
//                 ringWidth={47}
//                 needleTransitionDuration={3333}
//                 needleTransition="easeElastic"
//                 needleColor={'#90f2ff'}
//                 textColor={'#d8dee9'}
//             />
//         </div>
//     );
// }

// export default Speedometer;

import { useRef, useEffect } from "react";
import "chartjs-gauge";
import { Chart } from "chart.js";

const Speedometer = () => {
    const canvasRef = useRef();

    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
    };

    var randomData = function () {
        return [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
        ];
    };

    var randomValue = function (data) {
        return Math.max.apply(null, data) * Math.random();
    };

    var data = randomData();
    var value = randomValue(data);

    var config = {
        type: "gauge",
        data: {
            labels: ["Poor", "Bad", "Average", "Good", "Best"],
            datasets: [
                {
                    data: data,
                    value: value,
                    backgroundColor: ["#FC3A3A", "#E69724", "#FCF439", "#C1E8AF", "#7ACB59"],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Activity level"
            },
            layout: {
                padding: {
                    bottom: 30
                }
            },
            needle: {
                // Needle circle radius as the percentage of the chart area width
                radiusPercentage: 2,
                // Needle width as the percentage of the chart area width
                widthPercentage: 3.2,
                // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
                lengthPercentage: 80,
                // The color of the needle
                color: "#28659C"
            },
            valueLabel: {
                formatter: Math.round
            },
            hover: {
                mode: null // Disable hover effect
            }
        }
    };

    useEffect(() => {
        if (!canvasRef) {
            return;
        }
        let context = canvasRef.current.getContext("2d");
        console.log(context);
        window.myGauge = new Chart(context, config);
    });

    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    );
};

export default Speedometer;