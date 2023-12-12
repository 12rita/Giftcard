import * as React from 'react';
import { Card } from 'antd';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';
import { useMemo } from 'react';
import { mentionOptions } from '../../static/const';

const { Meta } = Card;
interface IStatisticsProps {
    countriesCount: number;
    countiesInfo: { [key: string]: string[] };
    homeless: { name: string; countriesCount: number }[];
}
export const Statistics = () => {
    const { data, isFetching } = useDataFromServer<IStatisticsProps>({
        url: ROUTES.STATISTICS,
        key: 'statistics-data'
    });

    const humans = useMemo(() => {
        if (!data) return [];
        return data?.data?.homeless?.map(({ name }) => {
            return mentionOptions.find(option => option.value === name)?.label;
        });
    }, [data]);

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
                            {humans.length > 1
                                ? 'Самые шиложопые кабэшники'
                                : 'Самый шиложопый кабэшник'}
                            {': '}
                            {humans.join(', ')}
                        </div>
                    </div>
                }
            />
        </Card>
    );
};
