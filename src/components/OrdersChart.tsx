import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import './componentsStyles.css';

const OrdersChart = ({ userOrders }) => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);
    const [period, setPeriod] = useState(7);
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        if (userOrders && userOrders.length > 0 && startDate === null) {
            setStartDate(moment(userOrders[0].createdAt));
        }
        if (userOrders && userOrders.length > 0 && startDate !== null) {
            const endDate = moment(startDate).clone().add(period - 1, 'days');

            const allDates = [];
            let currentDate = moment(startDate);

            while (currentDate <= endDate) {
                allDates.push(currentDate.format('DD-MM-YY'));
                currentDate = currentDate.clone().add(1, 'day');
            }

            const ordersInRange = userOrders.filter((order) =>
                moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')
            );

            const ordersCountByDate = allDates.reduce((acc, date) => {
                const count = ordersInRange.filter((order) => moment(order.createdAt).format('DD-MM-YY') === date)
                    .length;
                acc[date] = count;
                return acc;
            }, {});

            const chartLabels = Object.keys(ordersCountByDate);
            const chartData = Object.values(ordersCountByDate);

            const ctx = chartContainer.current.getContext('2d');

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Количество заказов',
                            data: chartData,
                            backgroundColor: 'rgba(231,231,231,0.64)',
                            borderColor: '#111111',
                            borderWidth: 1,
                            pointRadius: 2,
                            pointBackgroundColor: '#111111',
                            pointBorderColor: '#111111',
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Дата',
                                color: '#111111',
                            },
                            ticks: {
                                autoSkip: true,
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Количество заказов',
                                color: '#111111',
                            },
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [userOrders, period, startDate]);

    const changePeriod = (newPeriod) => {
        setPeriod(newPeriod);
        setStartDate(moment(userOrders[0].createdAt)); // Устанавливаем начальную дату при изменении периода
    };

    const handleDateChange = (direction) => {
        if (startDate === null) {
            setStartDate(moment(userOrders[0].createdAt)); // Устанавливаем начальную дату при первом переключении
        } else {
            const newStartDate = direction === 'prev' ? moment(startDate).subtract(period, 'days') : moment(startDate).add(period, 'days');
            setStartDate(newStartDate);
        }
    };

    return (
        <div className={'chartContainer'}>
            <canvas ref={chartContainer} />
            <div className={'chartBtnBlock'}>
                <div className={period !== 7 ? 'chartBtn' : 'selectedChartBtn'} onClick={() => changePeriod(7)}>7д</div>
                <div className={period !== 30 ? 'chartBtn' : 'selectedChartBtn'} onClick={() => changePeriod(30)}>30д</div>
                <div className={'chartBtn'} onClick={() => handleDateChange('prev')}>{'<'}</div>
                <div className={'chartBtn'} onClick={() => handleDateChange('next')}>{'>'}</div>
            </div>
        </div>
    );
};

export default OrdersChart;

