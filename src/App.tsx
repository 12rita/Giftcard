import * as React from 'react';
import './app.styles.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Map } from './modules/Map/Map';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './modules/AuthContext';
import { Header } from './modules/Header/Header';
import { ConfigProvider, theme } from 'antd';
import { backgroundColor } from './static/const';
import { Statistics } from './modules/Statistics/Statistics';
import { BrowserRouter, Router } from 'react-router-dom';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string;

const App = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#ff642d'
                                    // colorPrimaryBg: 'rgba(38,47,70,0.9)'
                                },
                                algorithm: theme.darkAlgorithm
                            }}
                        >
                            <div className={'wrapper'}>
                                <div
                                    className="app-container"
                                    style={{ background: backgroundColor }}
                                >
                                    <Header />
                                    <Map />
                                    <Statistics />
                                </div>
                            </div>
                        </ConfigProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
};
export default App;
