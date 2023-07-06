
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

            var stopitem = { id: "" + stopid + zoneId + distance,
                stopid: stopid,
                name: stopname,
                zoneId: zoneId,
                distance: distance,
                trips: [] };

            stop.node.stop.stoptimesWithoutPatterns.map((stoptime, index) => {

                var shortName = stoptime.trip.route.shortName;
                var headSign = stoptime.headsign;
                var realTimeDeparture = stoptime.realtimeDeparture;
                var key = index;

                // TODO: check why some trips have no headsign
                if(headSign && headSign.length > 0) {
                    stopitem.trips.push({ shortName: shortName, headSign: headSign, realTimeDeparture: realTimeDeparture, key: key });
                }
            });

            // Some special stops have no zoneId, lets not show them
            if(zoneId && zoneId.length > 0) {
                newStops.push(stopitem);
            }
            
        });

        // console.log("newStops: " + JSON.stringify(newStops, undefined, 2));
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

                // console.log("result: " + JSON.stringify(result, undefined, 2));
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
        <div className='text-center bg-orange-500 text-neutral-50 p-1 w-full'>
            <h1 className='text-4xl'><span className='px-2'>oma</span><span>stoppi</span></h1>
            <h3 className='text-l'>Lähimmät lähdöt HSL alueella</h3>
        </div>
    

        <ProgressText />

        { lat && <TheMap initialLat={lat} initialLong={long} mapClickedCallback={mapClickedCallback} /> }
        
        { stops && <StopList stops={stops} /> }

        <hr />
        <div className='text-center'><span>{lat} {long}</span></div>
        <hr />

        <div>
            <p>Voit tallettaa tämän sivun puhelimeesi käyttämällä 'Add to home page' -toimintoa selaimessa.</p>
        </div>

    </div>
    )
}