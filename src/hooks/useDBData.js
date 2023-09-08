import { useQuery } from 'react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const getDBData = async () =>
    await getDocs(collection(db, 'countryTests')).then(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    });

export const useDBData = () => {
    return useQuery({
        keepPreviousData: true,
        enabled: true,
        queryKey: ['dbData'],
        queryFn: async () => {
            return await getDBData();
        },
        // onSettled: (data, error) => console.log(data),
        retry: 3
    });
};
