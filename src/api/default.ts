import {
    ResponseType,
    Credentials,
    ResponseData,
    IRequestConfig
} from './types';

const responseType: ResponseType = 'json';
const credentials: Credentials = 'same-origin';

export const defaults: IRequestConfig = {
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
    },
    baseURL: '',
    transformResponse: <TData>(data: ResponseData<TData>): any => data,
    credentials,
    responseType
};
