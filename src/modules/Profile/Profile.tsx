import React, { useMemo } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, message } from 'antd';
import { useAuth } from '../AuthContext';

export const Profile: React.FC = () => {
    const { isAuthenticated, user, logout, login } = useAuth();
    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            void logout();
        } else if (key === 'login') {
            void login();
        }
    };

    const items: MenuProps['items'] = useMemo(
        () => [
            isAuthenticated
                ? {
                      label: 'Выйти',
                      key: 'logout'
                  }
                : {
                      label: 'Войти',
                      key: 'login'
                  }
            // {
            //     type: 'divider'
            // }
        ],
        [isAuthenticated]
    );
    // console.log({ picture: user?.picture, user });
    const avatarProps = useMemo(() => {
        if (!isAuthenticated) {
            return {
                icon: <UserOutlined />
            };
        }

        return {
            src: (
                <img
                    src={user?.picture}
                    referrerPolicy="no-referrer"
                    alt="avatar"
                    onError={() => {
                        void message.error('Ошибка загрузки аватара');
                    }}
                />
            )
        };
    }, [isAuthenticated, user]);

    return (
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
            <a
                style={{ display: 'flex' }}
                onClick={e => e.preventDefault()}
                className={'image'}
            >
                <Avatar
                    size="large"
                    {...avatarProps}
                    // onError={() => {
                    //     console.log('error');
                    // }}
                />
            </a>
        </Dropdown>
    );
};
