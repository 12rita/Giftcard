import * as React from 'react';
import { Card } from 'antd';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';

const { Meta } = Card;
interface IStatisticsProps {
    countriesCount: number;
    homeless: { id: number; name: string; countriesCount: number }[];
}
export const Statistics = () => {
    const { data, isFetching } = useDataFromServer<IStatisticsProps>({
        url: ROUTES.STATISTICS,
        key: 'statistics-data'
    });
    return (
        <Card
            style={{
                width: 350,
                marginTop: 16,
                position: 'absolute',
                fontSize: '16px',
                background: 'rgba(34, 46, 44, 0.5)',
                textAlign: 'left',
                bottom: '32px',
                left: '16px'
            }}
            loading={isFetching}
        >
            <Meta
                title="Статистика"
                description={
                    <div>
                        <div>
                            {'Стран, где ступала нога кабэшника: '}
                            {data?.data.countriesCount}
                        </div>
                        <div>
                            {data?.data.homeless.length > 1
                                ? 'Самые шиложопые кабэшники'
                                : 'Самый шиложопый кабэшник'}
                            {': '}
                            {data?.data.homeless
                                .map(item => item.name)
                                .join(', ')}
                        </div>
                    </div>
                }
            />
        </Card>
    );
};
