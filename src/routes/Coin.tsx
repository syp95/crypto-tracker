import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
    useLocation,
    useParams,
    Outlet,
    Link,
    useMatch,
    useNavigate,
} from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from './api';
import { Helmet } from 'react-helmet';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

const Container = styled.div`
    padding: 10px 30px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 15vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    background-color: #464646;
    border-radius: 10px 10px 0 0;
    position: relative;
`;

const Loader = styled.span`
    text-align: center;
    display: block;
    margin-top: 100px;
    font-size: 40px;
`;
const Title = styled.h1`
    color: ${(props) => props.theme.accentColor};
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #464646;
    padding: 10px 20px;
    border-radius: 0 0 10px 10px;
`;
const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    span:first-child {
        font-weight: 800;
        color: ${(props) => props.theme.accentColor};
    }
    span {
        font-size: 11px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
        display: block;
    }
`;
const Description = styled.p`
    margin: 20px 5px;
    font-size: 12px;
`;

const CoinNumber = styled.div`
    width: 40px;
    height: 40px;
    background-color: white;
    position: absolute;
    border-radius: 50%;
    top: 10px;
    right: 10px;
    text-align: center;
    padding-top: 9px;
    font-size: 20px;
`;

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) =>
        props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
    }
`;
const Button = styled.div`
    width: 40px;
    height: 40px;
    font-size: 12px;
    line-height: 18px;
    color: ${(props) => props.theme.accentColor};
    background-color: white;
    position: absolute;
    border-radius: 50%;
    top: 10px;
    left: 10px;
    text-align: center;
    cursor: pointer;
    padding-top: 9px;
`;

const ToggleButton = styled.div`
    width: 40px;
    height: 40px;
    font-size: 12px;
    line-height: 18px;
    color: ${(props) => props.theme.accentColor};
    background-color: white;
    position: absolute;
    border-radius: 50%;
    top: 10px;
    right: -50px;
    text-align: center;
    cursor: pointer;
    padding-top: 9px;
`;

interface RouteState {
    name: string;
    rank: number;
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

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

function Coin() {
    const { coinId } = useParams();
    const location = useLocation();
    const state = location.state as RouteState;
    const priceMatch = useMatch('/:coinId/price');
    const chartMatch = useMatch('/:coinId/chart');
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
        ['info', coinId],
        () => fetchCoinInfo(coinId),
    );

    const isDark = useRecoilValue(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev: any) => !prev);

    const navigate = useNavigate();
    const { isLoading: tickersLoading, data: tickersData } =
        useQuery<PriceData>(
            ['tickers', coinId],
            () => fetchCoinTickers(coinId),
            {
                refetchInterval: 10000,
            },
        );

    // const [loading, setLoading] = useState(true);
    // const [info, setInfo] = useState<InfoData>();
    // const [price, setPrice] = useState<PriceData>();
    // useEffect(() => {
    //     (async () => {
    //         const infoData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    //         ).json();
    //         const priceData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    //         ).json();

    //         setInfo(infoData);
    //         setPrice(priceData);
    //         setLoading(false);
    //     })();
    // }, [coinId]);

    const loading = infoLoading || tickersLoading;

    return (
        <Container>
            <Helmet>
                <title>Chart</title>
            </Helmet>
            <Header>
                <Title>
                    {state?.name
                        ? state.name
                        : loading
                        ? 'Loading...'
                        : infoData?.name}
                </Title>
                <CoinNumber>
                    {state?.rank ? state.rank : loading ? '?' : infoData?.rank}
                </CoinNumber>
                <Button as='a' onClick={() => navigate(-1)}>
                    <span>Back</span>
                </Button>
                <ToggleButton onClick={toggleDarkAtom}>
                    <span>{isDark ? 'day' : 'night'}</span>
                </ToggleButton>
            </Header>

            <Overview>
                <OverviewItem>
                    <div>
                        <span>Rank:</span>
                        <span>{infoData?.rank}</span>
                    </div>
                </OverviewItem>
                <OverviewItem>
                    <div>
                        <span>Symbol:</span>
                        <span>${infoData?.symbol}</span>
                    </div>
                </OverviewItem>
                <OverviewItem>
                    <div>
                        <span>Price:</span>
                        <span>{tickersData?.quotes.USD.price.toFixed(2)}</span>
                    </div>
                </OverviewItem>
            </Overview>
            <Description>{`${infoData?.description.slice(
                0,
                180,
            )}...`}</Description>
            <Overview>
                <OverviewItem>
                    <span>Total Suply:</span>
                    <span>{tickersData?.total_supply}</span>
                </OverviewItem>
                <OverviewItem>
                    <span>Max Supply:</span>
                    <span>{tickersData?.max_supply}</span>
                </OverviewItem>
            </Overview>
            <Tabs>
                <Tab isActive={chartMatch !== null}>
                    <Link to={`/${coinId}/chart`}>Chart</Link>
                </Tab>
                <Tab isActive={priceMatch !== null}>
                    <Link to={`/${coinId}/price`}>Price</Link>
                </Tab>
            </Tabs>
            <Outlet />
            {loading ? <Loader>Loading...</Loader> : null}
        </Container>
    );
}

export default Coin;
