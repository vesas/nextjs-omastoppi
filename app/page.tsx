
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

    /*
    const [geoLocationInUse, setIsGeoLocationInUse] = useState(false);

    const geolocationAPI = navigator.geolocation;

    const getUserCoordinates = () => {
        if (!geolocationAPI) {
            console.log('Geolocation API is not available in your browser!')
        } else {
            geolocationAPI.getCurrentPosition((position) => {
            const { coords } = position;
            setLat(coords.latitude);
            setLong(coords.longitude);
            setIsGeoLocationInUse(true);
            }, (error) => {
            console.log('Something went wrong getting your position!')
            });
        }
    }


    if (geolocationAPI) {
        getUserCoordinates();
    }

    if(!geoLocationInUse && !isLoading) {
        return <section>
        <p>It seems geolocation services are not enabled in your browser, please enable them if you want to to use this application.</p>
    </section>
    }

    useEffect(() => {
        
        setIsLoading(true);

        console.log("page: process.browser: " + process.browser);
        console.log("page: lat: " + lat + " long: " + long);

        stopsByRadius("" + lat, "" + long, 500).then((result: string) => {
            setLoadedData(result);
            console.log("result34: " + result);
            setIsLoading(false);
        }, (error) => {
            console.log("error: " + error);
            setIsLoading(false);
        });

        
        
    }, [lat, long]);
    */

    

    return (
    <div className='flex flex-col'>
    <h1 className='text-center text-4xl p-5 w-full'><span className='px-2'>oma</span><span>stoppi</span></h1>

    
    <ProgressText />

    <TheMap />
    </div>
    )
    
/*
    <p className="text-slate-500">Lähialueen lähdöt kätevästi yhdessä paikassa</p>
    <p>lat: {lat}</p>
    <p>long: {long}</p>
    <p>loadedData: {JSON.stringify(loadedData, undefined, 2)}</p>
    */
}