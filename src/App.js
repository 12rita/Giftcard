import React, { useEffect, useState } from 'react';
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

// const callBackendAPI = async () => {
//     const response = await fetch('/api');
//     console.log(response.url);
//     const body = await response.text();
//
//     if (response.status !== 200) {
//         throw Error(body.message);
//     }
//     return body;
// };

const App = () => {
    // const [state, setState] = useState(null);
    //
    // // получение GET маршрута с сервера Express, который соответствует GET из server.js
    // useEffect(() => {
    //     callBackendAPI()
    //         .then(res => {
    //             console.log(res);
    //             setState(res.express);
    //         })
    //         .catch(err => console.log(err));
    // }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <div className={'wrapper'}>
                <div className="app-container">
                    <div className="header">
                        <div>Кабэ в России и мире</div>
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
