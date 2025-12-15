import querystring from 'query-string';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult
} from '@tanstack/react-query';
import { api } from '../../api';
import type { IError, ResponseData } from '../../api';

const mutate = <TVariables, TResult>(
    path: string,
    data: TVariables
): Promise<ResponseData<TResult>> => {
    return api.post(
        `${path}`,
        {
            ...data
        },
        { responseType: 'text' }
    );
};

interface IPath<T> {
    path: string;
    urlSearchParams?: T;
}

export const useSingleMutation = <
    TVariables = unknown,
    TUrlSearchParams = unknown,
    TResult = unknown
>(
    path: string | IPath<TUrlSearchParams>,
    options?: UseMutationOptions<TResult, IError, TVariables>
): UseMutationResult<TResult, IError, TVariables> => {
    return useMutation(
        async (data: TVariables) => {
            const _path =
                typeof path === 'string'
                    ? path
                    : `${path?.path}?${querystring.stringify(
                          path.urlSearchParams,
                          {
                              arrayFormat: 'bracket'
                          }
                      )}`;

            try {
                const res = await mutate<TVariables, TResult>(_path, data);
                return res?.data;
            } catch (ex) {
                throw await ex;
            }
        },
        {
            ...options
        }
    );
};
