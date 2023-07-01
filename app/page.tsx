
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
    const [loadedData, setLoadedData] = useState("");

    const [geoLocationInUse, setIsGeoLocationInUse] = useState(false);

    const [stops, setStops] = useState([]); // stops

    function parseData(data) {
        // console.log("parseData: " + JSON.stringify(data, undefined, 2));

        var newStops = [];

        data.stopsByRadius.edges.map((stop) => {
            var stopid = stop.node.stop.gtfsId.replace("HSL:", "");
            // console.log("stopid: " + stopid);

            var stopitem = { id: stopid,
                trips: [] };

            stop.node.stop.stoptimesWithoutPatterns.map((stoptime) => {

                var shortName = stoptime.trip.route.shortName;
                var headSign = stoptime.headsign;
                var realTimeDeparture = stoptime.realtimeDeparture;

                // console.log("shortName: " + shortName + " headSign: " + headSign + " realTimeDeparture: " + realTimeDeparture);

                stopitem.trips.push({ shortName: shortName, headSign: headSign, realTimeDeparture: realTimeDeparture });
            });

            newStops.push(stopitem);
        });

        console.log("newStops: " + newStops);
        setStops(newStops);
    }

    function mapClickedCallback({ event, latLng, pixel }) {
        console.log("Page.map clicked callback: lat: " + latLng[0] + " long: " + latLng[1]);

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

        console.log("page: lat: " + lat + " long: " + long);

        if(lat && long) {
            setIsLoading(true);
            stopsByRadius(lat, long, 500).then((result: string) => {
                // console.log("result: " + JSON.stringify(result, undefined, 2));
                setLoadedData(result);
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
    <div className='text-center'><span>{lat} {long}</span></div>
    
    { stops && <StopList stops={stops} /> }
    
    </div>
    )
    
}