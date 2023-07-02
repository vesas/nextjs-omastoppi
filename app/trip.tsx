

function Trip(props) {

    function secondsToHm(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
    
        var hDisplay = h < 10 ? "0" + h.toString() : h.toString();
        var mDisplay = m < 10 ? "0" + m.toString() : m.toString();
        return hDisplay + ":" + mDisplay; 
    }

    return (
        <div>{secondsToHm(props.trip.realTimeDeparture)} - {props.trip.shortName} - {props.trip.headSign}</div>
    )
}

export default Trip;