import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import { Avatar, Drawer, List, Skeleton, Space } from 'antd';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';
import {
    DeleteFilled,
    DislikeFilled,
    DislikeOutlined,
    LikeFilled,
    LikeOutlined
} from '@ant-design/icons';
import countries_ru from '../../static/countries_ru.json';
import { backgroundColor } from '../../static/const';
import { ImageCarousel } from './ImageCarousel';
import { useHandleReaction } from '../hooks/useHandleReaction';

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
    const { data: details, isLoading } = useDataFromServer<IDetailsData[]>({
        url: ROUTES.DETAILS,
        params: { country },
        key: 'details-data',
        enabled: !!country
    });
    const countryName = countries_ru.Names[country] ?? country;
    const { reaction, setLocalReaction, setReaction, deleteMessage } =
        useHandleReaction();

    useLayoutEffect(() => {
        if (!details || !details.data) return;
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
    }, [details, setLocalReaction]);

    const getDate = useCallback((date: string) => {
        const [month, year] = date.split('-');
        return new Date(+year, +month).toLocaleDateString('ru', {
            year: 'numeric',
            month: 'long'
        });
    }, []);

    return (
        <>
            <Drawer
                title={countryName}
                width={720}
                onClose={onClose}
                open={!!country}
                drawerStyle={{ background: backgroundColor }}
                bodyStyle={{ paddingBottom: 80 }}
                // headerStyle={{ color: 'white' }}
            >
                {isLoading ? (
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
                        dataSource={details?.data ?? []}
                        renderItem={(item: IDetailsData) => (
                            <List.Item
                                key={item.date + item.name}
                                actions={[
                                    <div
                                        key="list-vertical-like-o"
                                        onClick={() => {
                                            setReaction(item, 'like');
                                        }}
                                    >
                                        <IconText
                                            icon={
                                                reaction[item.id]?.reaction ===
                                                1
                                                    ? LikeFilled
                                                    : LikeOutlined
                                            }
                                            text={`${
                                                reaction[item.id]?.likesCount ||
                                                0
                                            }`}
                                        />
                                    </div>,
                                    <div
                                        key="list-vertical-dislike-o"
                                        onClick={() => {
                                            setReaction(item, 'dislike');
                                        }}
                                    >
                                        <IconText
                                            icon={
                                                reaction[item.id]?.reaction ===
                                                -1
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
                                    description={item.description}
                                />

                                <ImageCarousel files={item.files} />
                            </List.Item>
                        )}
                    />
                )}
            </Drawer>
        </>
    );
};

const ListLoader = () => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={[]}
            renderItem={(item: IDetailsData) => (
                <List.Item
                    key={item.date + item.name}
                    actions={[
                        <IconText
                            key="list-vertical-like-o"
                            icon={LikeOutlined}
                            text={`${0}`}
                        />,

                        <IconText
                            key="list-vertical-dislike-o"
                            icon={DislikeOutlined}
                            text={`${0}`}
                        />
                    ]}
                >
                    <List.Item.Meta
                        style={{ color: 'white' }}
                        avatar={<Skeleton.Avatar />}
                        title={<Skeleton.Input />}
                        description={item.description}
                    />
                    <Skeleton.Image />
                </List.Item>
            )}
        />
    );
};
export default DetailsDrawer;
