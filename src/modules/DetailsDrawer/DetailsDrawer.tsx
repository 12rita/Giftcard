import * as React from 'react';
import { Avatar, Carousel, Drawer, List, Skeleton, Space } from 'antd';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { ROUTES } from '../../static/routes';
import { Image } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import countries_ru from '../../static/countries_ru.json';
import { backgroundColor } from '../../static/const';
interface IDetailsData {
    date: string;
    country: string;
    description: string;
    name: string;
    email: string;
    picture: string;
    files: {
        name: string;
        base64: string;
    }[];
}

const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
}));

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

    // const posts = useMemo(() => {
    //     if (!details) return [];
    //     return Object.keys(details?.data).map(date => {
    //         return details?.data[date][1];
    //     });
    // }, []);
    // const images = details
    //     ? Object.keys(details?.data).map(key => {
    //           return details?.data[key][1].files[0].base64;
    //       }) ?? []
    //     : [];
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    const contentStyle: React.CSSProperties = {
        margin: 0,
        // height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79'
    };

    const countryName = countries_ru.Names[country] ?? country;

    return (
        <>
            <Drawer
                title={countryName}
                width={720}
                onClose={onClose}
                open={!!country}
                drawerStyle={{ background: 'rgba(31,31,31,0.8)' }}
                bodyStyle={{ paddingBottom: 80 }}
                // headerStyle={{ color: 'white' }}
            >
                {isLoading ? (
                    <Skeleton />
                ) : (
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3
                        }}
                        dataSource={details?.data ?? []}
                        footer={
                            <div>
                                <b>ant design</b> footer part
                            </div>
                        }
                        renderItem={(item: IDetailsData) => (
                            <List.Item
                                key={item.date + item.name}
                                actions={[
                                    <IconText
                                        icon={StarOutlined}
                                        text="156"
                                        key="list-vertical-star-o"
                                    />,
                                    <IconText
                                        icon={LikeOutlined}
                                        text="156"
                                        key="list-vertical-like-o"
                                    />,
                                    <IconText
                                        icon={MessageOutlined}
                                        text="2"
                                        key="list-vertical-message"
                                    />
                                ]}
                                // extra={
                                //     <img
                                //         width={272}
                                //         alt="logo"
                                //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                //     />
                                // }
                            >
                                <List.Item.Meta
                                    style={{ color: 'white' }}
                                    avatar={<Avatar src={item.picture} />}
                                    title={<div>{item.name}</div>}
                                    description={item.description}
                                />

                                <Carousel infinite={false}>
                                    {item.files.map((image, idx) => {
                                        return (
                                            <div key={idx}>
                                                <div
                                                    id={'#wrapper'}
                                                    style={{
                                                        margin: 0,
                                                        height: '400px',
                                                        color: '#fff',
                                                        lineHeight: '160px',
                                                        textAlign: 'center'
                                                        // background: '#364d79'
                                                    }}
                                                >
                                                    <Image
                                                        height={400}
                                                        src={image.base64}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/*<div>*/}
                                    {/*    <h3 style={contentStyle}>1</h3>*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                    {/*    <h3 style={contentStyle}>2</h3>*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                    {/*    <h3 style={contentStyle}>3</h3>*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                    {/*    <h3 style={contentStyle}>4</h3>*/}
                                    {/*</div>*/}
                                </Carousel>
                            </List.Item>
                        )}
                    />
                )}
            </Drawer>
        </>
    );
};

export default DetailsDrawer;
