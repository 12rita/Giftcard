export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type Credentials = 'omit' | 'same-origin' | 'include';

export type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'patch'
    | 'PATCH';

export interface IRequestConfig {
    url?: string;
    method?: Method;
    baseURL?: string;
    credentials?: Credentials;
    responseType?: ResponseType;
    headers?: any;
    id?: string;
    data?: any;
    params?: any;
    mode?: RequestMode;
    signal?: AbortSignal;
    transformResponse?: <TData>(data: ResponseData<TData>) => any;
}

export interface ResponseSchema<TData> {
    status: number;
    statusText: string;
    message?: string;
    data: TData;
}
export interface IError {
    message?: string;
}

export interface BaseData {
    auth_uri?: string;
}

export interface ResponseData<TData> {
    status: number;
    statusText: string;
    data: TData;
}
