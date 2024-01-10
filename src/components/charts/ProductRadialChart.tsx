import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../componentsStyles.css';

const ProductRadialChart = ({ product }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (product && product.sizes) {
            const sizes = product.sizes.map((size) => size.size);
            const amounts = product.sizes.map((size) => size.amount);

            const ctx = chartRef.current.getContext('2d');

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: sizes,
                    datasets: [
                        {
                            label: 'Размеры',
                            data: amounts,
                            borderColor: '#111111',
                            backgroundColor: 'rgba(17,17,17,0.2)',
                            pointBackgroundColor: '#111111',
                            pointBorderColor: '#fff',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scale: {
                        pointLabels: {
                            fontSize: 10,
                        },
                        ticks: {
                            display: true,
                            stepSize: 2,
                            min: 0,
                        },
                    },
                },
            });
        }
    }, [product]);

    return <canvas ref={chartRef} />;
};

export default ProductRadialChart;
