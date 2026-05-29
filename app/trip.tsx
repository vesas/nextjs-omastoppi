

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

    // Minutes from now until departure. realTimeDeparture is seconds since
    // midnight of the service day, so compare against the current wall-clock
    // seconds since midnight.
    function minutesUntil(d) {
        d = Number(d);
        const now = new Date();
        const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        let diff = d - nowSeconds;
        if(diff < -43200) { // departure is past midnight relative to now (>12h behind)
            diff += 86400;
        }
        return Math.round(diff / 60);
    }

    const mins = minutesUntil(props.trip.realTimeDeparture);
    const relative = mins <= 0 ? "nyt" : mins + " min";

    return (
        <div>
            <span className="inline-block w-16 font-semibold tabular-nums">{relative}</span>
            <time className="text-neutral-500">{secondsToHm(props.trip.realTimeDeparture)}</time>
            {" - "}{props.trip.shortName} - {props.trip.headSign}
        </div>
    )
}

export default Trip;