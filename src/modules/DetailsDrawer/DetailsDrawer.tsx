import * as React from 'react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from 'react';
import { Avatar, Drawer, List, message, Select, Skeleton, Space } from 'antd';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';
import {
    CheckOutlined,
    CloseOutlined,
    DeleteFilled,
    DislikeFilled,
    DislikeOutlined,
    EditOutlined,
    LikeFilled,
    LikeOutlined
} from '@ant-design/icons';
import countries_ru from '../../static/countries_ru.json';
import { backgroundColor, mentionOptions } from '../../static/const';
import { ImageCarousel } from './ImageCarousel';
import { useHandleReaction } from '../hooks/useHandleReaction';
import { isEqual } from 'lodash';
import TextArea from 'antd/es/input/TextArea';
import { useSingleMutation } from '../hooks/useSingleMutation';
import { useSelect } from '../hooks/useSelect';
import { queryClient } from '../../App';

export interface IDetailsData {
    date: string;
    country: string;
    description: string;
    name: string;
    email: string;
    picture: string;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    isDeletable: boolean;
    id: number;
    mentions: string;
    files: {
        name: string;
        base64: string;
    }[];
}

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const DetailsDrawer = ({
    country,
    onClose
}: {
    country: string;
    onClose: () => void;
}) => {
    const { data: details, isFetching } = useDataFromServer<IDetailsData[]>({
        url: ROUTES.DETAILS,
        params: { country },
        key: 'details-data',
        enabled: !!country
    });
    const countryName = countries_ru.Names[country] ?? country;
    const {
        reaction,
        setLocalReaction,
        saveReactionGlobal,
        setReaction,
        deleteMessage,
        loading
    } = useHandleReaction();
    const [countryDetails, setCountryDetails] = React.useState<IDetailsData[]>(
        []
    );

    const defaultReaction = useMemo(() => {
        const reaction = {};
        details?.data?.forEach(item => {
            reaction[item.id] = {
                likesCount: item.likes,
                dislikesCount: item.dislikes,
                reaction: item.isLiked ? 1 : item.isDisliked ? -1 : 0
            };
        });
        return reaction;
    }, [details]);

    useLayoutEffect(() => {
        if (!details || !details.data || isFetching) return;
        details.data.forEach(item => {
            setLocalReaction(prev => ({
                ...prev,
                [item.id]: {
                    likesCount: item.likes,
                    dislikesCount: item.dislikes,
                    reaction: item.isLiked ? 1 : item.isDisliked ? -1 : 0
                }
            }));
        });
        setCountryDetails(details.data);
    }, [details, isFetching, setLocalReaction]);

    const getDate = useCallback((date: string) => {
        const [month, year] = date.split('-');
        return new Date(+year, +month).toLocaleDateString('ru', {
            year: 'numeric',
            month: 'long'
        });
    }, []);

    const handleCLose = useCallback(() => {
        setCountryDetails([]);
        if (!isEqual(reaction, defaultReaction)) {
            saveReactionGlobal();
        }
        onClose();
    }, [defaultReaction, onClose, reaction, saveReactionGlobal]);

    return (
        <>
            <Drawer
                title={countryName}
                width={720}
                onClose={handleCLose}
                open={!!country}
                drawerStyle={{ background: backgroundColor }}
                bodyStyle={{ paddingBottom: 80 }}
                // headerStyle={{ color: 'white' }}
            >
                {isFetching || loading ? (
                    <ListLoader />
                ) : (
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={
                            details?.data?.length > 3
                                ? {
                                      pageSize: 3
                                  }
                                : null
                        }
                        dataSource={countryDetails}
                        renderItem={(item: IDetailsData) => {
                            return (
                                <List.Item
                                    key={item.date + item.name}
                                    actions={[
                                        <div
                                            key="list-vertical-like-o"
                                            onClick={() => {
                                                setReaction(item, 'like');
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <IconText
                                                icon={
                                                    reaction[item.id]
                                                        ?.reaction === 1
                                                        ? LikeFilled
                                                        : LikeOutlined
                                                }
                                                text={`${
                                                    reaction[item.id]
                                                        ?.likesCount || 0
                                                }`}
                                            />
                                        </div>,
                                        <div
                                            key="list-vertical-dislike-o"
                                            onClick={() => {
                                                setReaction(item, 'dislike');
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <IconText
                                                icon={
                                                    reaction[item.id]
                                                        ?.reaction === -1
                                                        ? DislikeFilled
                                                        : DislikeOutlined
                                                }
                                                text={`${
                                                    reaction[item.id]
                                                        ?.dislikesCount || 0
                                                }`}
                                            />
                                        </div>,
                                        item.isDeletable && (
                                            <div
                                                key="list-vertical-delete-o"
                                                onClick={() => {
                                                    deleteMessage(item);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <DeleteFilled />
                                            </div>
                                        )
                                    ]}
                                >
                                    <List.Item.Meta
                                        style={{ color: 'white' }}
                                        avatar={<Avatar src={item.picture} />}
                                        title={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '16px',
                                                    alignItems: 'baseline'
                                                }}
                                            >
                                                <div> {item.name}</div>
                                                <div
                                                    style={{
                                                        color: 'rgba(255, 255, 255, 0.45)',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    {getDate(item.date)}
                                                </div>
                                            </div>
                                        }
                                        description={
                                            <DescriptionPart
                                                id={item.id}
                                                description={item.description}
                                            />
                                        }
                                    />

                                    <ImageCarousel files={item.files} />
                                    <List.Item.Meta
                                        style={{ marginTop: '16px' }}
                                        description={
                                            <MentionsPart
                                                mentions={item.mentions}
                                                id={item.id}
                                            />
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </Drawer>
        </>
    );
};

interface ISaveDescription {
    description: string;
    messageId: number;
}
const DescriptionPart: React.FC<{ description: string; id: number }> = ({
    description,
    id
}) => {
    const [editable, setEditable] = useState(false);
    const [value, setValue] = useState('');
    const saveData = useSingleMutation<ISaveDescription>(
        ROUTES.DESCRIPTION_EDIT
    );

    useEffect(() => {
        setValue(description);
    }, [description]);

    const onChange = useCallback((ev: { target: { value: string } }) => {
        setValue(ev.target.value);
    }, []);

    const handleEdit = useCallback(() => {
        setEditable(true);
    }, []);

    const onCancel = useCallback(() => {
        setEditable(false);
        setValue(description);
    }, [description]);

    const save = useCallback(() => {
        saveData.mutate(
            { description: value, messageId: id },
            {
                onSuccess: () => {
                    setEditable(false);
                    void queryClient.invalidateQueries(['map-data']);
                    // setValue(value);
                },
                onError: err => {
                    void message.error(err.message);
                }
            }
        );
    }, [id, saveData, value]);
    return (
        <div>
            {editable ? (
                <div>
                    <TextArea
                        value={value}
                        onChange={onChange}
                        placeholder={'Добавьте описание'}
                    />
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <CheckOutlined onClick={save} />
                        <CloseOutlined onClick={onCancel} />
                    </div>
                </div>
            ) : (
                <div>
                    {value || 'Добавьте описание'}
                    <EditOutlined
                        style={{ marginLeft: '8px' }}
                        onClick={handleEdit}
                    />
                </div>
            )}
        </div>
    );
};

interface ISaveMentions {
    messageId: number;
    mentions: string;
}
const MentionsPart: React.FC<{ mentions: string; id: number }> = ({
    mentions,
    id
}) => {
    const [editable, setEditable] = useState(false);
    const [value, setValue] = useState([] as string[]);
    const saveData = useSingleMutation<ISaveMentions>(ROUTES.MENTIONS_EDIT);

    const mentionValue = useMemo(() => {
        if (!mentions) return [];
        return (mentions || '')
            .split(',')
            .map(
                mention =>
                    mentionOptions.find(option => option.value === mention)
                        ?.value
            );
    }, [mentions]);

    const mentionDisplay = useMemo(() => {
        if (!value) return '';
        return value
            .map(
                mention =>
                    mentionOptions.find(option => option.value === mention)
                        ?.label
            )
            .join(', ');
    }, [value]);

    const setDefault = useCallback(() => {
        setValue(mentionValue);
    }, [mentionValue]);

    useEffect(() => {
        setDefault();
    }, [mentions, setDefault]);
    const { onSearch, filterOption } = useSelect();

    const onChange = useCallback((val: string[]) => {
        setValue(val);
    }, []);

    const handleEdit = useCallback(() => {
        setEditable(true);
    }, []);

    const onCancel = useCallback(() => {
        setEditable(false);
        setDefault();
    }, [setDefault]);

    const save = useCallback(() => {
        saveData.mutate(
            { mentions: value.join(','), messageId: id },
            {
                onSuccess: () => {
                    setEditable(false);
                    void queryClient.invalidateQueries(['map-data']);
                    // setValue(value);
                },
                onError: err => {
                    void message.error(err.message);
                }
            }
        );
    }, [id, saveData, value]);
    return (
        <div>
            {editable ? (
                <div>
                    <Select
                        style={{ width: '100%' }}
                        mode="multiple"
                        showSearch
                        onChange={onChange}
                        value={value}
                        onSearch={onSearch}
                        options={mentionOptions}
                        filterOption={filterOption}
                        placeholder="Раз кабэшник, два кабэшник..."
                    />
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <CheckOutlined onClick={save} />
                        <CloseOutlined onClick={onCancel} />
                    </div>
                </div>
            ) : (
                <div>
                    {'На фото: ' + mentionDisplay || 'Добавьте кабэшников'}
                    <EditOutlined
                        style={{ marginLeft: '8px' }}
                        onClick={handleEdit}
                    />
                </div>
            )}
        </div>
    );
};
const ListLoader = () => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={[{ date: '', name: '', description: '' }]}
            renderItem={item => (
                <List.Item key={'loader-item'}>
                    <List.Item.Meta
                        style={{ color: 'white' }}
                        avatar={<Skeleton.Avatar active />}
                        title={<Skeleton.Input active />}
                        description={item.description}
                    />
                    <Skeleton.Image
                        active
                        style={{ width: '600px', height: '300px' }}
                    />
                </List.Item>
            )}
        />
    );
};
export default DetailsDrawer;
