import { useState, useEffect } from "react";

import { Map, Marker } from "pigeon-maps"

function TheMap(props) {

    const [zoom, setZoom] = useState(16)

    function mapClicked({ event, latLng, pixel }) {

        props.mapClickedCallback({ event, latLng, pixel });
    }

    return (
    <Map height={380} defaultCenter={[props.initialLat, props.initialLong]} zoom={zoom} onClick={({ event, latLng, pixel }) => { mapClicked({ event, latLng, pixel }); }} />
    );
}

export default TheMap;