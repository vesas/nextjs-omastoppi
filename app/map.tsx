import { useState, useEffect } from "react";

import { Map, Marker } from "pigeon-maps"

function TheMap(props) {

    const [zoom, setZoom] = useState(16)

    console.log("map: initial lat: " + props.initialLat + " initial long: " + props.initialLong + " typeof lat: " + typeof props.initialLat + " typeof long: " + typeof props.initialLong);

    function mapClicked({ event, latLng, pixel }) {
        console.log("map clicked");

        props.mapClickedCallback({ event, latLng, pixel });
    }

    return (
    <Map height={380} defaultCenter={[props.initialLat, props.initialLong]} zoom={zoom} onClick={({ event, latLng, pixel }) => { mapClicked({ event, latLng, pixel }); }} />
    );
}

/* <Marker width={50} anchor={[50.879, 4.6997]} /> */
export default TheMap;