import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchCoins } from './api';
import { Helmet } from 'react-helmet';
import { isDarkAtom } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';

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

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: #fff;
    color: ${(props) => props.theme.bgColor};
    margin-top: 20px;
    border-radius: 10px;

    img {
        width: 30px;
        position: absolute;
        transform: translate(-210%, -15%);
    }
    a {
        padding: 20px;
        transition: color 0.1s ease-in;
        display: block;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.accentColor};
        }
    }
`;

const Title = styled.h1`
    color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
    margin-top: 100px;
    font-size: 40px;
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

interface ICoin {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
}

function Coins() {
    const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins);
    const isDark = useRecoilValue(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev: any) => !prev);
    // const [loading, setLoading] = useState(true);
    // const [coins, setCoins] = useState<CoinInterface[]>([]);
    // useEffect(() => {
    //     (async () => {
    //         const response = await fetch(
    //             'https://api.coinpaprika.com/v1/coins',
    //         );
    //         const json = await response.json();
    //         setCoins(json.slice(0, 29));
    //         setLoading(false);
    //     })();
    // }, []);
    return (
        <Container>
            <Helmet>
                <title>Coins</title>
            </Helmet>
            <Header>
                <Title>Coins</Title>
                <ToggleButton onClick={toggleDarkAtom}>
                    <span>{isDark ? 'day' : 'night'}</span>
                </ToggleButton>
            </Header>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <CoinsList>
                    {data?.slice(0, 100).map((coin) => (
                        <Coin key={coin.id}>
                            <Link
                                to={`/${coin.id}`}
                                state={{ name: coin.name, rank: coin.rank }}>
                                <img
                                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                                />
                                {coin.name} <span>&rarr;</span>
                            </Link>
                        </Coin>
                    ))}
                </CoinsList>
            )}
        </Container>
    );
}

export default Coins;
