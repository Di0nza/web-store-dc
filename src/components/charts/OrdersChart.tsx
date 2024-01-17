import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import '../componentsStyles.css';

const OrdersChart = ({ userOrders }) => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);
    const [period, setPeriod] = useState(7);
    const [startDate, setStartDate] = useState(null);
    const [selectedStat, setSelectedStat] = useState('orders');
    const [selectedStatInfo, setSelectedStatInfo] = useState({
        orders: { label: 'Количество заказов', value: null },
        totalCost: { label: 'Суммарный доход', value: null },
    });

    const updateSelectedStatInfo = () => {
        if (userOrders && userOrders.length > 0 && startDate !== null) {
            const endDate = moment(startDate).clone().add(period - 1, 'days');
            const ordersInRange = userOrders.filter(order =>
                moment(order.createdAt).isBetween(startDate, endDate, null, '[]')
            );

            const ordersCount = ordersInRange.length;
            const totalCost = ordersInRange.reduce((sum, order) => sum + order.totalCost, 0);

            setSelectedStatInfo({
                ...selectedStatInfo,
                orders: { ...selectedStatInfo.orders, value: ordersCount },
                totalCost: { ...selectedStatInfo.totalCost, value: totalCost },
            });
        }
    };

    const changeStat = (stat) => {
        setSelectedStat(stat);
    };


    useEffect(() => {
        updateSelectedStatInfo();
        if(selectedStat === 'cost') {
            if (userOrders && userOrders.length > 0 && startDate === null) {
                setStartDate(moment(userOrders[0].createdAt));
            }
            if (userOrders && userOrders.length > 0 && startDate !== null) {
                const endDate = moment(startDate).clone().add(period - 1, 'days');

                const datesInRange = [];
                let currentDate = moment(startDate);

                while (currentDate <= endDate) {
                    datesInRange.push(currentDate.format('DD-MM-YY'));
                    currentDate = currentDate.clone().add(1, 'day');
                }

                const dataByDate = datesInRange.reduce((acc, date) => {
                    const ordersInRange = userOrders.filter(order =>
                        moment(order.createdAt).format('DD-MM-YY') === date
                    );

                    const totalCost = ordersInRange.reduce((sum, order) => sum + order.totalCost, 0);
                    const orderCount = ordersInRange.length;

                    acc[date] = {
                        totalCost,
                        orderCount,
                    };
                    return acc;
                }, {});

                const chartLabels = Object.keys(dataByDate);
                const chartData = chartLabels.map(date => dataByDate[date].totalCost);

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
                                label: 'Суммарный доход($)',
                                data: chartData,
                                backgroundColor: 'rgba(231, 231, 231, 0.64)',
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
                                    text: 'Суммарный доход($)',
                                    color: '#111111',
                                },
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        } else if (selectedStat === 'orders') {
            if (userOrders && userOrders.length > 0 && startDate === null) {
                setStartDate(moment(userOrders[0].createdAt));
            }
            if (userOrders && userOrders.length > 0 && startDate !== null) {
                const endDate = moment(startDate).clone().add(period - 1, 'days');

                const datesInRange = [];
                let currentDate = moment(startDate);

                while (currentDate <= endDate) {
                    datesInRange.push(currentDate.format('DD-MM-YY'));
                    currentDate = currentDate.clone().add(1, 'day');
                }

                const ordersInRange = userOrders.filter(order =>
                    datesInRange.includes(moment(order.createdAt).format('DD-MM-YY'))
                );

                const ordersCountByDate = datesInRange.reduce((acc, date) => {
                    const count = ordersInRange.filter(order =>
                        moment(order.createdAt).format('DD-MM-YY') === date
                    ).length;
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
        }

    }, [userOrders, period, startDate, selectedStat]);

    const changePeriod = (newPeriod) => {
        setPeriod(newPeriod);
        setStartDate(moment(userOrders[0].createdAt));
    };

    const handleDateChange = (direction) => {
        if (userOrders && userOrders.length > 0) {
            if (startDate === null) {
                setStartDate(moment(userOrders[0].createdAt));
            } else {
                const newStartDate = direction === 'prev' ? moment(startDate).subtract(period, 'days') : moment(startDate).add(period, 'days');
                setStartDate(newStartDate);
            }
        } else {
            console.error('Нет данных о заказах');
        }
    };

    return (
        <div className={'chartContainer'}>
            <canvas ref={chartContainer}/>
            <div className={'periodResults'}>
                <p><b>Количество заказов:</b> {selectedStatInfo.orders.value}</p>
                <p><b>Доход:</b> {selectedStatInfo?.totalCost.value?.toFixed(2)}$</p>
                <p className={'periodResultsExplanations'}>Информация за выбранный промежуток времени</p>
            </div>
            <div className={'chartBtnBlock'}>
                <div className={'chartBtnCategory'}>
                    <div className={selectedStat === 'orders' ? 'selectedChartCategoryBtn' : 'chartCategoryBtn'}
                         onClick={() => changeStat('orders')}>Заказы
                    </div>
                    <div className={selectedStat === 'cost' ? 'selectedChartCategoryBtn' : 'chartCategoryBtn'}
                         onClick={() => changeStat('cost')}>Доход
                    </div>
                </div>
                <div className={'chartBtnCategory'}>
                    <div className={period !== 7 ? 'chartBtn' : 'selectedChartBtn'} onClick={() => changePeriod(7)}>7д
                    </div>
                    <div className={period !== 30 ? 'chartBtn' : 'selectedChartBtn'}
                         onClick={() => changePeriod(30)}>30д
                    </div>
                    <div className={'chartBtn'} onClick={() => handleDateChange('prev')}>{'<'}</div>
                    <div className={'chartBtn'} onClick={() => handleDateChange('next')}>{'>'}</div>
                </div>
            </div>
        </div>
    );
};
export default OrdersChart;

