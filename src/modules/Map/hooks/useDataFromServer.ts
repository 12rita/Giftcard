import { useQuery } from '@tanstack/react-query';
import { api, ResponseData } from '../../../api';

export interface IMessageData {
    id: number;
    owner: string;
    country: string;
    description: string;
    date: string;
}
export const getDataFromServer = async (): Promise<
    ResponseData<IMessageData[]>
> => await api.get('/api/map');

export const useDataFromServer = () => {
    return useQuery({
        keepPreviousData: true,
        enabled: true,
        queryKey: ['dbData'],
        queryFn: async () => {
            return await getDataFromServer();
        },
        // onSettled: (data, error) => console.log(data),
        retry: 3
    });
};
