import querystring from 'query-string';
import { IRequestConfig, Method, BaseData, ResponseData } from './types';
import { defaults } from './default';

class Api {
    private _config: IRequestConfig;

    constructor(config: IRequestConfig) {
        this._config = config;
    }

    private async handlingResponse<TData extends BaseData>(
        response: Response,
        config: IRequestConfig
    ): Promise<ResponseData<TData>> {
        const { responseType, transformResponse } = config;

        // if (response.status === 401) {
        //     const { data } = await response.json();
        //     window.location.href = '/';
        // }
        if (response.status === 502) {
            throw {
                data: {
                    message: 'Request has been blocked by application firewall'
                },
                status: response.status,
                statusText: response.statusText
            };
        }
        if (responseType === 'text') {
            try {
                const data = await response.text();
                const responseData: ResponseData<string> = {
                    status: response.status,
                    statusText: response.statusText,
                    data
                };
                if (transformResponse) {
                    return transformResponse(responseData);
                }

                // @ts-ignore
                return responseData;
            } catch (ex) {
                throw {
                    status: response.status,
                    statusText: response.statusText,
                    data: {
                        message: 'Parsed error: ' + (ex as string)
                    }
                };
            }
        }
        if (responseType === 'json') {
            try {
                const data = await response.json();
                const responseData: ResponseData<TData> = {
                    status: response.status,
                    statusText: response.statusText,
                    data
                };
                if (transformResponse) {
                    return transformResponse(responseData);
                }
                return responseData;
            } catch (ex) {
                throw {
                    status: response.status,
                    statusText: response.statusText,
                    data: {
                        message: 'Parsed error: ' + (ex as string)
                    }
                };
            }
        }
        throw {
            status: response.status,
            statusText: response.statusText,
            data: {
                message: 'Network response was not ok.'
            }
        };
    }

    async request<TData extends BaseData>(
        config: IRequestConfig
    ): Promise<ResponseData<TData>> {
        config = Object.assign({}, this._config, config);
        const {
            headers,
            method,
            params = {},
            credentials,
            data,
            baseURL,
            mode,
            signal
        } = config;
        const queryParams =
            Object.keys(params).length > 0
                ? `?${querystring.stringify(params, {
                      arrayFormat: 'bracket'
                  })}`
                : '';
        const url = `${baseURL}${config.url}${queryParams}`;
        const isFormData = data instanceof FormData;
        const body = data ? (isFormData ? data : JSON.stringify(data)) : null;

        const response = await fetch(url, {
            headers: isFormData ? { Accept: '*/*' } : headers,
            mode,
            credentials,
            method,
            body,
            signal
        });

        if (!response.ok) {
            if (response?.type === 'opaque') {
                // condition for no-cors mode
                // @ts-ignore
                return { data: true };
            }
            throw await this.handlingResponse(response, config);
        }
        return await this.handlingResponse(response, config);
    }

    get<TData>(
        url: string,
        config: IRequestConfig = {}
    ): Promise<ResponseData<TData>> {
        const method: Method = 'get';
        return this.request<TData>(
            Object.assign({}, config, {
                url,
                method
            })
        );
    }

    post<TData, TVariables>(
        url: string,
        data?: TVariables,
        config = {}
    ): Promise<ResponseData<TData>> {
        const method: Method = 'post';
        return this.request<TData>(
            Object.assign({}, config, {
                url,
                data,
                method
            })
        );
    }

    patch<TData, TVariables>(
        url: string,
        data?: TVariables,
        config = {}
    ): Promise<ResponseData<TData>> {
        const method: Method = 'PATCH';
        return this.request<TData>(
            Object.assign({}, config, {
                url,
                data,
                method
            })
        );
    }

    delete<TData, TVariables>(
        url: string,
        data?: TVariables,
        config = {}
    ): Promise<ResponseData<TData>> {
        const method: Method = 'delete';
        return this.request<TData>(
            Object.assign({}, config, {
                url,
                data,
                method
            })
        );
    }

    all<TData>(promises = []): Promise<TData[]> {
        return Promise.all(promises);
    }

    allSettled<TData>(promises = []): Promise<PromiseSettledResult<TData>[]> {
        return Promise.allSettled(promises);
    }
}

const api = new Api(defaults);

export { api, Api };
