import { Carousel, Image } from 'antd';
import * as React from 'react';

interface ICarousel {
    files: {
        name: string;
        base64: string;
    }[];
}
export const ImageCarousel: React.FC<ICarousel> = ({ files }) => {
    return (
        <Carousel infinite={false}>
            {files.map((image, idx) => {
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
                                placeholder={true}
                            />
                        </div>
                    </div>
                );
            })}
        </Carousel>
    );
};
