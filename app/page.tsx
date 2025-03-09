
'use client';

import { useEffect, useState } from 'react';

import { stopsByRadius } from './stopsByRadius';

import ProgressText from './progresstext';
import TheMap from './map';
import StopList from './stoplist';

export default function Page() {

    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isGeoLocationInUse, setIsGeoLocationInUse] = useState(false);

    const [stops, setStops] = useState([]); // stops

    function parseData(data) {

        const newStops = [];

        data.stopsByRadius.edges.map((stop) => {
            const stopid = stop.node.stop.gtfsId.replace("HSL:", "");
            const stopname = stop.node.stop.name;
            const zoneId = stop.node.stop.zoneId;
            const distance = stop.node.distance;
            const lat = stop.node.stop.lat;
            const lon = stop.node.stop.lon;

            const stopitem = { id: "" + stopid + zoneId + distance,
                stopid: stopid,
                name: stopname,
                zoneId: zoneId,
                lat: lat,
                lon: lon,
                distance: distance,
                trips: [] };

            stop.node.stop.stoptimesWithoutPatterns.map((stoptime, index) => {

                const shortName = stoptime.trip.route.shortName;
                const headSign = stoptime.headsign;
                const realTimeDeparture = stoptime.realtimeDeparture;
                const key = index;

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

        setStops(newStops);
    }

    function mapClickedCallback({ event, latLng, pixel }) {
        setLat(latLng[0]);
        setLong(latLng[1]);
    }

    function geoLocate() {
        global.navigator?.geolocation?.getCurrentPosition((position) => {
            const { coords } = position;

            const latitude = coords.latitude;
            const longitude = coords.longitude;
            setLat(latitude);
            setLong(longitude);
            setIsGeoLocationInUse(true);
        }, () => {
            console.log('Something went wrong getting your position!')
        });
    }

    function geoLocateAndFetch() {
        geoLocate();
        if(lat && long) {
            setIsLoading(true);
            stopsByRadius(lat, long, 500).then((result: string) => {

                parseData(result);
                setIsLoading(false);
            }, (error) => {
                console.log("error: " + error);
            });
        }
    }

    useEffect(() => {
        geoLocate();
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

    if(!isGeoLocationInUse && !isLoading) {
        return <section>
        <p>It seems geolocation services are not enabled in your browser, please enable them if you want to to use this application.</p>
    </section>
    }

    function mapBoundsChanged({ center, zoom, bounds, initial }) {
        console.log("mapBoundsChanged: " + JSON.stringify({ center, zoom, bounds, initial }, undefined, 2));
    }

    return (
    <div className='flex flex-col'>
        <div className='text-center bg-orange-500 text-neutral-50 p-1 w-full'>
            <h1 className='text-4xl'><span className='px-2'>oma</span><span>stoppi</span></h1>
            <h3 className='text-l'>Lähimmät lähdöt HSL alueella</h3>
        </div>
    

        <ProgressText />

        { lat && <TheMap initialLat={lat} initialLong={long} mapClickedCallback={mapClickedCallback} onBoundsChanged={mapBoundsChanged} stops={stops} /> }
        
        { stops && <StopList stops={stops} /> }

        <button onClick={geoLocateAndFetch}>Paikanna uudelleen</button>

        <hr />
        <div className='text-center'><span>{lat} {long}</span></div>
        <hr />

        <div>
            <p>Voit tallettaa tämän sivun puhelimesi näytölle käyttämällä 'Add to home screen' -toimintoa selaimessa.</p>
        </div>
    </div>
    )
}