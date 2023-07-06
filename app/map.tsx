import { useState, useEffect } from "react";

import { Map, Marker, Overlay } from "pigeon-maps"

function TheMap(props) {

    const [zoom, setZoom] = useState(16)

    function mapClicked({ event, latLng, pixel }) {

        props.mapClickedCallback({ event, latLng, pixel });
    }

    const stopmarkers = [];

    props.stops.map((stop) => {
        const lat = parseFloat(stop.lat);
        const lon = parseFloat(stop.lon);

        stopmarkers.push(<Overlay anchor={[lat, lon]} offset={[12, 12]}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        </Overlay>);
    });

    return (
    <Map height={380} defaultCenter={[props.initialLat, props.initialLong]} zoom={zoom} onClick={({ event, latLng, pixel }) => { mapClicked({ event, latLng, pixel }); }}>
        <Marker width={26} anchor={[props.initialLat, props.initialLong]} ></Marker>

        {stopmarkers}
        
    </Map>
    
    );
}

export default TheMap;