

function Trip(props) {

    function secondsToHm(d) {
        d = Number(d);
        if(d > 86400) { // for some reason some departure times are over 24 hours, so we subtract 24 hours
            d = d - 86400;
        }
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
    
        const hDisplay = h < 10 ? "0" + h.toString() : h.toString();
        const mDisplay = m < 10 ? "0" + m.toString() : m.toString();
        return hDisplay + ":" + mDisplay; 
    }

    return (
        <div><time>{secondsToHm(props.trip.realTimeDeparture)}</time> - {props.trip.shortName} - {props.trip.headSign}</div>
    )
}

export default Trip;