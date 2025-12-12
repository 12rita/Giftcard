import * as React from 'react';
import { useState } from 'react';
import {
    Button,
    Drawer,
    Form,
    Space,
    message,
    UploadFile,
    Skeleton
} from 'antd';

import { useSingleMutation } from '../hooks/useSingleMutation';
import { queryClient } from '../../App';
import { ROUTES } from '../../static/routes';
import { AddForm } from './AddForm';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../AuthContext';
import { Login } from '../Login/Login';
import { backgroundColor } from '../../static/const';

interface IPostData {
    dateTime: string;
    owner: string;
    country: string;
    files: { name: string; base64: string }[];
    description: string;
    mentions: string;
}

const AddDrawer = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);
    const saveData = useSingleMutation<IPostData>(ROUTES.MESSAGE_SAVE);
    const values = Form.useWatch([], form);
    const { isAuthenticated, isLoggingIn, user } = useAuth();

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            }
        );
    }, [form, values, open, setSubmittable]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const onSubmit = () => {
        const values = form.getFieldsValue();
        const {
            file,
            country,
            owner,
            dateTime,
            description = '',
            members = []
        } = values;

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
                description,
                mentions: (members as string[]).join(',')
            },
            {
                onSuccess: () => {
                    void message.success('Ваша фоточка успешно загружена!');
                    onClose();
                    void queryClient.invalidateQueries({ queryKey: ['year'] });
                },
                onError: () => {
                    void message.error('Всё сломалось, переделывай!');
                }
            }
        );
    };

    return (
        <>
            <Button
                type="primary"
                onClick={showDrawer}
                icon={<PlusOutlined />}
                // style={{ background: buttonColor }}
            >
                Внести свой вклад
            </Button>
            <Drawer
                title="Добавить свои фот очки"
                width={720}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                drawerStyle={{ background: backgroundColor }}
                extra={
                    isAuthenticated && user.isWhitelisted ? (
                        <Space>
                            <Button onClick={onClose}>Отмена</Button>
                            <Button
                                onClick={onSubmit}
                                disabled={!submittable}
                                loading={saveData.isLoading}
                                type="primary"
                                // style={{ background: buttonColor }}
                            >
                                Загрузить
                            </Button>
                        </Space>
                    ) : null
                }
            >
                {isAuthenticated ? (
                    user.isWhitelisted ? (
                        <AddForm form={form} />
                    ) : (
                        <div
                            style={{
                                color: 'rgba(255, 255, 255, 0.85)',
                                marginBottom: '8px'
                            }}
                        >
                            Вы ненастоящий кабэшник
                        </div>
                    )
                ) : isLoggingIn ? (
                    <Skeleton />
                ) : (
                    <Login />
                )}
            </Drawer>
        </>
    );
};

export default AddDrawer;
