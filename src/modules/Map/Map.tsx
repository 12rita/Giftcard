import * as React from 'react';
import { useLayoutEffect, useMemo } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import { useDataFromServer } from '../hooks/useDataFromServer';
import { Circle } from '@amcharts/amcharts5';
import { ROUTES } from '../../static/routes';

interface ICity {
    id: string;
    name: string;
    value: number;
}
export interface IMessageData {
    [key: string]: string;
}
export const Map = ({ onClick }: { onClick: (country: string) => void }) => {
    const { data: serverData } = useDataFromServer<IMessageData>({
        url: ROUTES.GEOGRAPHY,
        key: 'map-data'
    });

    const cities: ICity[] = useMemo(() => {
        if (!serverData) return [];
        return Object.keys(serverData.data)?.map(key => ({
            id: key,
            name: key,
            value: +serverData.data[key]
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
                projection: am5map.geoMercator(),
                panX: 'rotateX'
            })
        );

        chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                fill: am5.color('#9a4e03'),
                exclude: ['AQ']
            })
        );

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

            const circle = container.children.push(
                am5.Circle.new(
                    root,
                    {
                        radius: 10,
                        fillOpacity: 0.7,
                        fill: am5.color('#DA6A00')
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
                        fill: am5.color('#9d03a8'),
                        cursorOverStyle: 'pointer',
                        tooltipText: `{name}: [bold]{value}[/]`
                    },

                    circleTemplate
                )
            );

            circle2.events.on('click', ev => {
                onClick((ev?.target?.dataItem?.dataContext as ICity)?.name);
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
    }, [cities, onClick]);

    return <div id="mapChart" style={{ width: '100%', height: '80vh' }} />;
};
