import * as React from 'react';
import { useAuth } from '../AuthContext';
import { Button } from 'antd';

export const Login = () => {
    const { login } = useAuth();

    return (
        <div>
            <div>Можно только кабэшникам</div>
            <Button onClick={() => login()}>Доказать кабэшность</Button>
        </div>
    );
};
