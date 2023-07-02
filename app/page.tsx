
'use client';

import { use, useEffect, useState } from 'react';

import { stopsByRadius } from './stopsByRadius';

import ProgressText from './progresstext';
import TheMap from './map';
import StopList from './stoplist';

export default function Page() {

    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [geoLocationInUse, setIsGeoLocationInUse] = useState(false);

    const [stops, setStops] = useState([]); // stops

    function parseData(data) {

        var newStops = [];

        data.stopsByRadius.edges.map((stop) => {
            var stopid = stop.node.stop.gtfsId.replace("HSL:", "");
            var stopname = stop.node.stop.name;
            var zoneId = stop.node.stop.zoneId;
            var distance = stop.node.distance;

            var stopitem = { id: stopid,
                name: stopname,
                zoneId: zoneId,
                distance: distance,
                trips: [] };

            stop.node.stop.stoptimesWithoutPatterns.map((stoptime) => {

                var shortName = stoptime.trip.route.shortName;
                var headSign = stoptime.headsign;
                var realTimeDeparture = stoptime.realtimeDeparture;

                stopitem.trips.push({ shortName: shortName, headSign: headSign, realTimeDeparture: realTimeDeparture });
            });

            newStops.push(stopitem);
        });

        setStops(newStops);
    }

    function mapClickedCallback({ event, latLng, pixel }) {
        setLat(latLng[0]);
        setLong(latLng[1]);
    }

    useEffect(() => {
        if (global.navigator && global.navigator.geolocation) {
            global.navigator.geolocation.getCurrentPosition((position) => {
                const { coords } = position;
    
                const latitude = coords.latitude;
                const longitude = coords.longitude;
                setLat(latitude);
                setLong(longitude);
                setIsGeoLocationInUse(true);
            }), () => {
                console.log('Something went wrong getting your position!')
            }
          } else {
            console.log("Geolocation not supported");
          }
    }, []);

    useEffect(() => {

        if(lat && long) {
            setIsLoading(true);
            stopsByRadius(lat, long, 500).then((result: string) => {
                parseData(result);
                setIsLoading(false);
            }, (error) => {
                console.log("error: " + error);
            });
        }
        

    }, [lat, long]);

    if(!geoLocationInUse && !isLoading) {
        return <section>
        <p>It seems geolocation services are not enabled in your browser, please enable them if you want to to use this application.</p>
    </section>
    }

    return (
    <div className='flex flex-col'>
    <h1 className='text-center text-4xl p-2 w-full bg-orange-500 text-neutral-50'><span className='px-2'>oma</span><span>stoppi</span></h1>

    <ProgressText />

    { lat && <TheMap initialLat={lat} initialLong={long} mapClickedCallback={mapClickedCallback} /> }
    
    { stops && <StopList stops={stops} /> }

    <hr />
    <div className='text-center'><span>{lat} {long}</span></div>
    <hr />

    <div>
        <p>You can add this web page as an icon to your phone's home screen by using the 'Add to home screen' functionality in your browser.</p>
    </div>

    </div>
    )
}