import { useQuery } from '@tanstack/react-query';
import { api, ResponseData } from '../../api';

export const getDataFromServer = async <T>(
    url: string,
    params?: any
): Promise<ResponseData<T>> => await api.get(url, { params });

interface IDataProps {
    url: string;
    key: string | string[];
    enabled?: boolean;
    params?: any;
}
export const useDataFromServer = <T>({
    url,
    key,
    enabled = true,
    params
}: IDataProps) => {
    return useQuery({
        //@ts-ignore
        enabled,
        queryKey: key,
        queryFn: async () => {
            return await getDataFromServer<T>(url, params);
        },
        retry: 1
    });
};
