import AddDrawer from '../AddDrawer/AddDrawer';
import * as React from 'react';
import { Profile } from '../Profile/Profile';
// import cn from 'cn';
import { Dropdown, MenuProps, Space } from 'antd';
import styles from './styles.module.css';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const Header: React.FC = () => {
    const [year, setYear] = React.useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isFetching } = useDataFromServer<string[]>({
        url: ROUTES.YEARS,
        key: 'years'
    });

    const setDropdownYear: MenuProps['onClick'] = ({ key }) => {
        setYear(key);
        if (!key) setSearchParams({});
        else setSearchParams({ date: key });
    };

    const items: MenuProps['items'] = useMemo(() => {
        const newItems: MenuProps['items'] =
            data?.data?.map(item => ({
                label: <div>{item}</div>,
                key: item
            })) ?? [];
        newItems.push(
            {
                type: 'divider'
            },
            { label: <div>Everytime</div>, key: '' }
        );
        return newItems;
    }, [data?.data]);

    const DropdownMenu = (
        <Dropdown
            className={styles.dropdown}
            menu={{ items, onClick: setDropdownYear }}
            trigger={['click']}
        >
            <a onClick={e => e.preventDefault()}>
                <Space>{year || 'Everytime'}</Space>
            </a>
        </Dropdown>
    );

    return (
        <div className={styles.header}>
            <div>Кабэ в России и мире: {DropdownMenu} edition</div>
            <div className="addDrawer">
                <AddDrawer />
            </div>
            <Profile />
        </div>
    );
};
