import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';

import {
    Col,
    Form,
    Input,
    DatePicker,
    Row,
    Select,
    Upload,
    Modal,
    message,
    UploadFile,
    FormInstance
} from 'antd';

import { useSelect } from '../hooks/useSelect';
import { useUpload } from '../hooks/useUpload';
import { mentionOptions } from '../../static/const';

const MB_SIZE = 1024 * 1024;

interface IAddForm {
    form: FormInstance;
}
export const AddForm: React.FC<IAddForm> = ({ form }) => {
    const { onSearch, onChange, filterOption, countryOptions } = useSelect();

    const {
        handlePreview,
        fileList,
        handleChange,
        normFile,
        previewTitle,
        previewImage,
        previewOpen,
        handleCancel,
        getBase64
    } = useUpload();

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

    return (
        <>
            <Form layout="vertical" form={form}>
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
                    {/*<Col span={12}>*/}
                    {/*    <Form.Item*/}
                    {/*        name="owner"*/}
                    {/*        label="Владелец"*/}
                    {/*        rules={[*/}
                    {/*            {*/}
                    {/*                required: true,*/}
                    {/*                message: 'Никаких анонимов!'*/}
                    {/*            }*/}
                    {/*        ]}*/}
                    {/*    >*/}
                    {/*        <Input placeholder="Введите ваше кабэшное имя" />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                    <Col span={12}>
                        <Form.Item
                            name="dateTime"
                            label="Когда"
                            rules={[
                                { required: true, message: 'Надо за этот год' }
                            ]}
                        >
                            <DatePicker
                                onChange={() => {}}
                                picker="month"
                                placeholder="Выберите месяц"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
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
                                                    501
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
                                // multiple={true}
                                accept={
                                    'image/png, image/gif, image/jpeg, image/svg'
                                }
                                fileList={fileList}
                                previewFile={getBase64}
                                onPreview={file => {
                                    void handlePreview(file);
                                }}
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
                        <Form.Item name="members" label="Кто ещё на фото">
                            <Select
                                mode="multiple"
                                showSearch
                                onChange={onChange}
                                onSearch={onSearch}
                                options={mentionOptions}
                                filterOption={filterOption}
                                placeholder="Раз кабэшник, два кабэшник..."
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="description" label="Описание">
                            <Input.TextArea
                                style={{ width: '100%' }}
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
        </>
    );
};
