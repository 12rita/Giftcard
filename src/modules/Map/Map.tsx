import * as React from 'react';
import { useLayoutEffect, useMemo } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import { useDataFromServer } from './hooks/useDataFromServer';
import countryCoords from '../../static/countryCoords.json';
import { GeoJsonTypes } from 'geojson';
export const Map = () => {
    const { data: serverData } = useDataFromServer();

    const cities = useMemo(() => {
        return {
            type: 'FeatureCollection',
            features:
                serverData &&
                (serverData?.data?.map(item => {
                    const { country, description, owner } = item ?? {};

                    const countryCoordinates = countryCoords[country] ?? [];

                    return {
                        type: 'Feature' as GeoJsonTypes,
                        properties: {
                            name: country,
                            description,
                            owner
                        },
                        geometry: {
                            type: 'Point' as GeoJsonTypes,
                            coordinates: [
                                countryCoordinates?.[0],
                                countryCoordinates?.[1]
                            ]
                        }
                    };
                }) ??
                    [])
        };
    }, [serverData]);

    useLayoutEffect(() => {
        const root = am5.Root.new('mapChart');
        root.setThemes([
            am5themes_Animated.new(root),
            am5themes_Dark.new(root)
        ]);

        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoMercator()
            })
        );

        chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                fill: am5.color('#9a4e03'),
                exclude: ['AQ']
            })
        );

        const pointSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                // @ts-ignore
                geoJSON: cities
            })
        );
        // console.log({ cities });

        pointSeries.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: am5.color('#DA6A00')
                })
            });
        });
        return () => {
            root.dispose();
        };
    }, [cities]);

    return <div id="mapChart" style={{ width: '100%', height: '500px' }} />;
};
