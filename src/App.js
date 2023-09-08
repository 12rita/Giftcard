import React from 'react';
import './app.styles.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Map } from './Map/Map';

import AddDrawer from './AddDrawer/AddDrawer';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className={'wrapper'}>
                <div className="app-container">
                    <div className="header">
                        <div>Кабэшные перемещения</div>
                        <div className="footer">
                            <AddDrawer />
                        </div>
                    </div>

                    <Map />
                </div>
            </div>
        </QueryClientProvider>
    );
};
export default App;
