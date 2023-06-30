import { useState, useEffect } from "react";

import { Map, Marker } from "pigeon-maps"

function TheMap(props) {

    const [zoom, setZoom] = useState(16)

    console.log("map: lat: " + props.lat + " long: " + props.long + " typeof lat: " + typeof props.lat + " typeof long: " + typeof props.long);

    function mapClicked({ event, latLng, pixel }) {
        console.log("map clicked");
    }

    return (
      <Map height={400} defaultCenter={[props.lat, props.long]} zoom={zoom} onClick={({ event, latLng, pixel }) => { mapClicked({ event, latLng, pixel }); }} />
      
      );
}

/* <Marker width={50} anchor={[50.879, 4.6997]} /> */
export default TheMap;