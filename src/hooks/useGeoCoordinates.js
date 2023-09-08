import { useQuery } from 'react-query';
import opencage from 'opencage-api-client';

const resolveAll = promises => {
    return Promise.all(promises);
};
export const getGeoCoordinates = async (countryCodes, id) => {
    return await resolveAll(
        countryCodes.map(countryCode => {
            return opencage
                .geocode({
                    countrycode: String(countryCode).toLowerCase(),
                    key: process.env.REACT_APP_OPENCAGE_API_KEY,
                    q: countryCode
                })
                .then(data => {
                    return {
                        coordinates: data?.results?.[0]?.geometry,
                        countryCode,
                        id
                    };
                });
        })
    );
    // return await opencage
    //     .geocode({
    //         countrycode: String(countryCode).toLowerCase(),
    //         key: API_KEY,
    //         q: countryCode
    //     })
    //     .then(data => {
    //         return data?.results?.[0]?.geometry;
    //     });
};

export const useGeoCoordinates = ({ countryCodes, enabled, id }) => {
    return useQuery({
        keepPreviousData: true,
        enabled: enabled,
        queryKey: ['geo-coordinates'],
        queryFn: async () => {
            return await getGeoCoordinates(countryCodes, id);
        },
        retry: 3
    });
};
