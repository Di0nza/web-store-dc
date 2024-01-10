import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProductViewsFavorites = ({ product }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (product) {
            const ctx = chartRef.current.getContext('2d');
            const favoritesData = product.favorites;
            const viewsData = product.views;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [`Избрвнное: ${product.favorites}`, `Просмотры: ${product.views}`],
                    datasets: [
                        {
                            label: 'Количество',
                            data: [favoritesData, viewsData],
                            backgroundColor: ['#505050', '#afafaf'],
                            borderColor: '#fafafa',
                            borderWidth: 1,
                        },
                    ],
                },
            });
        }
    }, [product]);

    return <canvas ref={chartRef} width={200} height={200} />;
};

export default ProductViewsFavorites;





