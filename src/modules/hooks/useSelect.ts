import countries_ru from '../../static/countries_ru.json';

export const useSelect = () => {
    const onChange = () => {
        // console.log(`selected ${value}`);
    };
    const onSearch = () => {
        // console.log('search:', value);
    };

    const countryOptions = Object.keys(countries_ru.Names).map(key => ({
        value: key,
        label: countries_ru.Names[key]
    }));

    const filterOption = (input: string, option: { label: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return { onChange, onSearch, filterOption, countryOptions };
};
