
'use client';

import { use, useEffect, useState } from 'react';

import { stopsByRadius } from './stopsByRadius';

import ProgressText from './progresstext';
import TheMap from './map';

export default function Page() {

    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [loadedData, setLoadedData] = useState("");

    const [geoLocationInUse, setIsGeoLocationInUse] = useState(false);

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

    if(!geoLocationInUse && !isLoading) {
        return <section>
        <p>It seems geolocation services are not enabled in your browser, please enable them if you want to to use this application.</p>
    </section>
    }

    useEffect(() => {

        setIsLoading(true);

        console.log("page: lat: " + lat + " long: " + long);

        if(lat && long) {
            stopsByRadius(lat, long, 500).then((result: string) => {
                console.log("result: " + JSON.stringify(result, undefined, 2));
                setLoadedData(result);
                setIsLoading(false);
            }, (error) => {
                console.log("error: " + error);
                setIsLoading(false);
            });
        }
        

    }, [lat, long]);
    

    return (
    <div className='flex flex-col'>
    <h1 className='text-center text-4xl p-2 w-full bg-orange-500 text-neutral-50'><span className='px-2'>oma</span><span>stoppi</span></h1>

    <ProgressText />

    
    { !isLoading && <TheMap lat={lat} long={long} /> }
    <div className='text-center'><span>{lat} {long}</span></div>
    
    </div>
    )
    
}