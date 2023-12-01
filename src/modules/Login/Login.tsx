import * as React from 'react';
import { useAuth } from '../AuthContext';
import { Button } from 'antd';

export const Login = () => {
    const { login } = useAuth();

    return (
        <div>
            <div style={{color:'rgba(255, 255, 255, 0.85)', marginBottom:'8px'}}>Можно только кабэшникам</div>
            <Button onClick={() => login()}>Доказать кабэшность</Button>
        </div>
    );
};
