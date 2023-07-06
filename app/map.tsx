import { useState, useEffect } from "react";

import { Map, Marker, Overlay } from "pigeon-maps"

import Tooltip from "./tooltip";

function TheMap(props) {

    const [zoom, setZoom] = useState(16)

    function mapClicked({ event, latLng, pixel }) {

        props.mapClickedCallback({ event, latLng, pixel });
    }

    function stopClicked() {
        // console.log("stopClicked");
    }

    function makeTooltipText(stop) {
        return stop.stopid + ":" + stop.name;
    }

    const stopmarkers = [];

    props.stops.map((stop, idx) => {
        const lat = parseFloat(stop.lat);
        const lon = parseFloat(stop.lon);

        stopmarkers.push(<Overlay key={idx} anchor={[lat, lon]} offset={[12, 12]}>
            <Tooltip text={makeTooltipText(stop)}>
            <span onClick={stopClicked}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            </span>
            </Tooltip>
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