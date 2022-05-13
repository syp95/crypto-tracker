import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoinHistory, fetchCoinTickers } from './api';
import styled from 'styled-components';

const Box = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #464646;
    width: 100%;
    height: 50px;
    border-radius: 10px;
`;
interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

function Price() {
    const { coinId } = useParams();

    const { isLoading, data } = useQuery<PriceData>(
        ['tickers', coinId],
        () => fetchCoinTickers(coinId),
        {
            refetchInterval: 10000,
        },
    );
    console.log(data);

    return (
        <div>
            {isLoading ? (
                'Loading...'
            ) : (
                <Box>
                    <span>price : ${data?.quotes.USD.price.toFixed(2)}</span>
                </Box>
            )}
        </div>
    );
}

export default Price;
