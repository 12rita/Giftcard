import * as React from 'react';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import countries_ru from '../../static/countries_ru.json';
import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    DatePicker,
    Row,
    Select,
    Space,
    Upload,
    Modal,
    message,
    UploadFile
} from 'antd';

import { useSingleMutation } from '../hooks/useSingleMutation';
import { queryClient } from '../../App';
import { RcFile } from 'antd/es/upload';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { IMessageData } from '../Map/Map';
import { ROUTES } from '../../static/routes';

const MB_SIZE = 1024 * 1024;

interface IPostData {
    dateTime: string;
    owner: string;
    country: string;
    files: { name: string; base64: string }[];
    description: string;
}
const getBase64 = (file: RcFile): Promise<string | ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const DetailsDrawer = ({
    country,
    onClose
}: {
    country: string;
    onClose: () => void;
}) => {
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);

    const { data: serverData } = useDataFromServer<IMessageData>({
        url: ROUTES.DETAILS,
        key: 'details-data',
        enabled: !!country
    });

    const saveData = useSingleMutation<IPostData>('/api/map/save');

    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            }
        );
    }, [form, values, open]);

    const onSubmit = () => {
        const values = form.getFieldsValue();
        const { file, country, owner, dateTime, description = '' } = values;
        const files = (file as UploadFile[]).map(file => ({
            name: file.name,
            base64: file.thumbUrl
        }));

        const { $y, $M } = dateTime;

        saveData.mutate(
            {
                dateTime: `${$M}-${$y}`,
                owner,
                country,
                files,
                description
            },
            {
                onSuccess: () => {
                    void message.success('Ваша фоточка успешно загружена!');
                    onClose();
                    void queryClient.invalidateQueries(['dbData']);
                },
                onError: () => {
                    void message.error('Всё сломалось, переделывай!');
                }
            }
        );
    };

    const normFile = (e: { fileList: UploadFile[] }) => {
        return e?.fileList;
    };

    const countryOptions = Object.keys(countries_ru.Names).map(key => ({
        value: key,
        label: countries_ru.Names[key]
    }));

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([] as UploadFile[]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = (await getBase64(file.originFileObj)) as string;
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        );
    };

    const handleChange = ({
        fileList: newFileList
    }: {
        fileList: UploadFile[];
    }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );
    const onChange = () => {
        // console.log(`selected ${value}`);
    };
    const onSearch = () => {
        // console.log('search:', value);
    };

    const filterOption = (input: string, option: { label: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            {/*<Button*/}
            {/*    type="primary"*/}
            {/*    onClick={showDrawer}*/}
            {/*    style={{ background: '#DA6A00' }}*/}
            {/*>*/}
            {/*    Внести свой вклад*/}
            {/*</Button>*/}
            <Drawer
                title={country}
                width={720}
                onClose={onClose}
                open={!!country}
                // drawerStyle={{ backgroundColor: '#9f9f9f' }}
                bodyStyle={{ paddingBottom: 80 }}
            ></Drawer>
        </>
    );
};

export default DetailsDrawer;
