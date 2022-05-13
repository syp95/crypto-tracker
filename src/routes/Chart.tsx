import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchCoinHistory } from './api';
import ApexChart from 'react-apexcharts';

interface IHistoricalData {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
    map: any;
}

function Chart() {
    const { coinId } = useParams();

    const { isLoading, data } = useQuery<IHistoricalData>(
        ['chart', coinId],
        () => fetchCoinHistory(coinId),
    );
    return (
        <div>
            {isLoading ? (
                'Loading...'
            ) : (
                <ApexChart
                    type='candlestick'
                    series={[
                        {
                            data: data?.map((price: any) => {
                                return {
                                    x: price.time_open,
                                    y: [
                                        price.open.toFixed(2),
                                        price.high.toFixed(2),
                                        price.low.toFixed(2),
                                        price.close.toFixed(2),
                                    ],
                                };
                            }),
                        },
                    ]}
                    options={{
                        theme: {
                            mode: 'light',
                        },
                        chart: {
                            height: 500,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                        },
                        plotOptions: {
                            candlestick: {
                                colors: {
                                    upward: '#DF7D46',
                                    downward: '#3C90EB',
                                },
                            },
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                show: true,
                                format: 'M/dd',
                            },
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: false,
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                        yaxis: {
                            labels: {
                                show: false,
                            },
                        },
                    }}
                />
            )}
        </div>
    );
}
export default Chart;
