
'use client';

import { useEffect, useState } from 'react';

import { stopsByRadius } from './stopsByRadius';

import ProgressText from './progresstext';
import dynamic from 'next/dynamic';
const TheMap = dynamic(() => import('./map'), { ssr: false });
import StopList from './stoplist';
import { useVehiclePositions } from './hooks/useVehiclePositions';

export default function Page() {

    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    // null = no error; 'denied' = permission refused; 'unavailable' = position
    // could not be determined or the browser has no geolocation API.
    const [geoError, setGeoError] = useState(null);

    const [stops, setStops] = useState([]); // stops

    // Drives the live countdown: a periodic re-render so each Trip recomputes
    // its "X min" from the current time without refetching stop data.
    const [, setTick] = useState(0);

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
        setIsLoading(true);
        setGeoError(null);
        const geo = global.navigator?.geolocation;
        if (!geo) {
            setGeoError('unavailable');
            setIsLoading(false);
            return;
        }
        geo.getCurrentPosition((position) => {
            const { coords } = position;

            const latitude = coords.latitude;
            const longitude = coords.longitude;
            localStorage.setItem('lastLat', String(latitude));
            localStorage.setItem('lastLong', String(longitude));
            setGeoError(null);
            setLat(latitude);
            setLong(longitude);
        }, (error) => {
            // code 1 === PERMISSION_DENIED
            setGeoError(error && error.code === 1 ? 'denied' : 'unavailable');
            setIsLoading(false);
        }, { maximumAge: 30000 });
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
        const cachedLat = localStorage.getItem('lastLat');
        const cachedLong = localStorage.getItem('lastLong');
        if (cachedLat && cachedLong) {
            setLat(parseFloat(cachedLat));
            setLong(parseFloat(cachedLong));
        }
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

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 30000);
        return () => clearInterval(interval);
    }, []);

    const { vehicles } = useVehiclePositions(lat, long, !!lat && !!long);

    if(geoError && !lat) {
        return (
            <section className='text-center p-6 max-w-md mx-auto'>
                <h1 className='text-2xl font-semibold mb-2'>Sijaintia ei saatu</h1>
                <p className='mb-4 text-neutral-700'>
                    {geoError === 'denied'
                        ? 'Salli paikannus selaimen asetuksista nähdäksesi lähimmät pysäkit.'
                        : 'Sijaintiasi ei juuri nyt voitu määrittää. Tarkista paikannus ja yhteys, ja yritä uudelleen.'}
                </p>
                <button
                    onClick={geoLocateAndFetch}
                    className='bg-orange-500 text-neutral-50 px-4 py-2 rounded'>
                    Yritä uudelleen
                </button>
            </section>
        );
    }

    return (
    <div className='flex flex-col'>
        <div className='text-center bg-orange-500 text-neutral-50 p-1 w-full'>
            <h1 className='text-4xl'><span className='px-2'>oma</span><span>stoppi</span></h1>
            <h3 className='text-l'>Lähimmät lähdöt HSL alueella</h3>
        </div>
    
        { lat && <TheMap initialLat={lat} initialLong={long} mapClickedCallback={mapClickedCallback} stops={stops} vehicles={vehicles} /> }
        
        { isLoading
            ? <ProgressText />
            : stops.length > 0
                ? <StopList stops={stops} />
                : <p className='text-center p-4 text-neutral-600'>Ei pysäkkejä 500 metrin säteellä.</p>
        }

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