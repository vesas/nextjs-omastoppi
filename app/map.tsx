import { useEffect } from "react";

import { Map, Marker } from "pigeon-maps"

const position = [51.505, -0.09]
function TheMap() {

    return (
      <Map height={600} defaultCenter={[60.181, 24.672]} defaultZoom={17}>
      </Map>
      );
}

/* <Marker width={50} anchor={[50.879, 4.6997]} /> */
export default TheMap;