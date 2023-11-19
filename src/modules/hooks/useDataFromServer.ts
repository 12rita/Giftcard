import { useQuery } from '@tanstack/react-query';
import { api, ResponseData } from '../../api';

export const getDataFromServer = async <T>(
    url: string
): Promise<ResponseData<T>> => await api.get(url);

interface IDataProps {
    url: string;
    key: string;
    enabled?: boolean;
}
export const useDataFromServer = <T>({
    url,
    key,
    enabled = true
}: IDataProps) => {
    return useQuery({
        keepPreviousData: true,
        enabled: enabled,
        queryKey: [key],
        queryFn: async () => {
            return await getDataFromServer<T>(url);
        },
        // onSettled: (data, error) => console.log(data),
        retry: 1
    });
};
