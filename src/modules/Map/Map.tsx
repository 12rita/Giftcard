import * as React from 'react';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { Circle } from '@amcharts/amcharts5';
import { ROUTES } from '../../static/routes';
import { circleColor, mapColor, outerCircleColor } from '../../static/const';
import countries_ru from '../../static/countries_ru.json';
import DetailsDrawer from '../DetailsDrawer/DetailsDrawer';
import { useAuth } from '../AuthContext';
import { getQueryParam } from '../../utils/getQueryParams';
import { useSearchParams } from 'react-router';

interface ICity {
    id: string;
    name: string;
    value: number;
}
export interface IMessageData {
    total: number;
    country: string;
}
export const Map = () => {
    const [activeCountry, setActiveCountry] = useState(null);

    const { isAuthenticated, user } = useAuth();
    const [searchParams] = useSearchParams();

    const onClick = useCallback((country: string) => {
        setActiveCountry(country);
    }, []);

    const year = useMemo(() => {
        return searchParams.get('date');
    }, [searchParams]);

    const onClose = () => {
        setActiveCountry(null);
    };

    const { data: serverData } = useDataFromServer<IMessageData[]>({
        url: ROUTES.GEOGRAPHY,
        key: ['year', year],
        params: {
            date: year
        }
    });

    const cities: ICity[] = useMemo(() => {
        if (!serverData) return [];
        return serverData.data?.map(item => ({
            id: item.country,
            name: countries_ru.Names[item.country] ?? item.country,
            value: +item.total
        }));
    }, [serverData]);

    useLayoutEffect(() => {
        const root = am5.Root.new('mapChart');
        root.setThemes([
            am5themes_Animated.new(root),
            am5themes_Dark.new(root)
        ]);

        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoEquirectangular(),
                panX: 'rotateX'
            })
        );
        // const gradient = am5.LinearGradient.new(root, {
        //     stops: [
        //         {
        //             color: am5.color('#312976')
        //         },
        //         {
        //             color: am5.color('#826AB4')
        //         }
        //     ]
        // });

        chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                fill: am5.color(mapColor),
                opacity: 0.9,
                exclude: ['AQ']
            })
        );
        // polygons.mapPolygons.template.setAll({ fill: gradient });
        // polygons. = gradient;

        // const pointSeries = chart.series.push(
        //     am5map.MapPointSeries.new(root, {
        //         // @ts-ignore
        //         geoJSON: cities
        //     })
        // );

        const bubbleSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                calculateAggregates: true,
                polygonIdField: 'id',
                valueField: 'value'
            })
        );

        const circleTemplate: am5.Template<Circle> = am5.Template.new({});

        bubbleSeries.bullets.push(function (root) {
            const container = am5.Container.new(root, {});

            container.children.push(
                am5.Circle.new(
                    root,
                    {
                        radius: 10,
                        fillOpacity: 0.7,
                        fill: am5.color(circleColor)
                    },

                    circleTemplate
                )
            );

            const circle2 = container.children.push(
                am5.Circle.new(
                    root,
                    {
                        radius: 10,
                        fillOpacity: 0.7,
                        fill: am5.color(outerCircleColor),
                        cursorOverStyle: 'pointer',
                        tooltipText: `{name} \n[bold]Кабэшников побывало: [/]{value}`
                    },

                    circleTemplate
                )
            );

            circle2.events.on('click', ev => {
                isAuthenticated &&
                    user.isWhitelisted &&
                    onClick((ev?.target?.dataItem?.dataContext as ICity)?.id);
            });

            // const countryLabel = container.children.push(
            //     am5.Label.new(root, {
            //         text: '{name}',
            //         paddingLeft: 5,
            //         populateText: true,
            //         fontWeight: 'bold',
            //         fontSize: 13,
            //         centerY: am5.p50
            //     })
            // );
            //
            // circle.on('radius', function (radius) {
            //     countryLabel.set('x', radius);
            // });
            circle2.animate({
                key: 'radius',
                from: 10,
                to: 50,
                duration: 1000,
                loops: Infinity,
                easing: am5.ease.yoyo(am5.ease.cubic)
            });
            circle2.animate({
                key: 'opacity',
                to: 0,
                from: 1,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity
            });

            return am5.Bullet.new(root, {
                sprite: container,
                dynamic: true
            });
        });

        // minValue and maxValue must be set for the animations to work
        // bubbleSeries.set('heatRules', [
        //     {
        //         target: circleTemplate,
        //         dataField: 'value',
        //         min: 10,
        //         max: 50,
        //         key: 'radius'
        //     }
        // ]);

        bubbleSeries.data.setAll(cities);

        void bubbleSeries.appear(1000);
        void chart.appear(1000, 100);
        return () => {
            root.dispose();
        };
    }, [cities, isAuthenticated, onClick, user.isWhitelisted]);

    return (
        <>
            <div id="mapChart" style={{ width: '100%', height: '80vh' }} />
            <DetailsDrawer country={activeCountry} onClose={onClose} />
        </>
    );
};
