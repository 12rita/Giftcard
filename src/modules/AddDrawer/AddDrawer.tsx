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

import { useSingleMutation } from './useSingleMutation';
import { queryClient } from '../../App';
import { RcFile } from 'antd/es/upload';

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

const AddDrawer = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);

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

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        form.resetFields();
        setOpen(false);
    };

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
            <Button
                type="primary"
                onClick={showDrawer}
                icon={<PlusOutlined />}
                style={{ background: '#DA6A00' }}
            >
                Внести свой вклад
            </Button>
            <Drawer
                title="Добавить свою фоточку"
                width={720}
                onClose={onClose}
                open={open}
                // drawerStyle={{ backgroundColor: '#9f9f9f' }}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!submittable}
                            type="primary"
                            style={{ background: '#DA6A00' }}
                        >
                            Загрузить
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="owner"
                                label="Владелец"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Никаких анонимов!'
                                    }
                                ]}
                            >
                                <Input placeholder="Введите ваше кабэшное имя" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dateTime" label="Когда">
                                <DatePicker
                                    onChange={() => {}}
                                    picker="month"
                                    placeholder="Выберите месяц"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="country"
                                label="Страна"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Без страны несчитово!'
                                    }
                                ]}
                            >
                                <Select
                                    showSearch
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    options={countryOptions}
                                    filterOption={filterOption}
                                    placeholder="Расскажите, где вы побывали"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="file"
                                label="Ваша прекрасная фот очка"
                                valuePropName={'fileList'}
                                getValueFromEvent={normFile}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ало, где фотка?'
                                    },
                                    {
                                        validator(_, fileList: UploadFile[]) {
                                            const filesSizeSum = fileList
                                                ? fileList.reduce(
                                                      (acc, file) =>
                                                          acc + file.size,
                                                      0
                                                  )
                                                : 0;
                                            return new Promise(
                                                (resolve, reject) => {
                                                    if (
                                                        filesSizeSum / MB_SIZE >
                                                        10
                                                    ) {
                                                        reject(
                                                            'Общий размер файлов должен быть меньше 10МБ! Ну-ка удаляем что-то!'
                                                        );
                                                        void message.error(
                                                            'Общий размер файлов должен быть меньше 10МБ! Умерьте ваши аппетиты!'
                                                        );
                                                    } else {
                                                        resolve('Success');
                                                    }
                                                }
                                            );
                                        }
                                    }
                                ]}
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                                {/*<FileUploader />*/}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="description" label="Описание">
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Пару слов от души"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img
                        alt="example"
                        style={{
                            width: '100%'
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>
        </>
    );
};

export default AddDrawer;
