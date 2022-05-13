import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Coins from './routes/Coins';
import Coin from './routes/Coin';
import Price from './routes/Price';
import Chart from './routes/Chart';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Coins />} />
                <Route path='/:coinId' element={<Coin />}>
                    <Route path='price' element={<Price />} />
                    <Route path='chart' element={<Chart />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
