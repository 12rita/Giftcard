import * as React from 'react';
import { useState } from 'react';
import './app.styles.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Map } from './modules/Map/Map';
import DetailsDrawer from './modules/DetailsDrawer/DetailsDrawer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './modules/AuthContext';
import { Header } from './modules/Header/Header';
import { ConfigProvider, theme } from 'antd';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

const App = () => {
    const [activeCountry, setActiveCountry] = useState(null);
    const onClick = (country: string) => {
        setActiveCountry(country);
    };

    const onClose = () => {
        setActiveCountry(null);
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                        <div className={'wrapper'}>
                            <div className="app-container">
                                <Header />
                                <Map onClick={onClick} />
                                <DetailsDrawer
                                    country={activeCountry}
                                    onClose={onClose}
                                />
                            </div>
                        </div>
                    </ConfigProvider>
                </AuthProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
};
export default App;
