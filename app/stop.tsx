
import Trip from "./trip";

function Stop(props) {

    return (
        <div>
            <div className="bg-orange-500 text-neutral-50">Stop {props.stop.stopid} - {props.stop.name} - {props.stop.distance}m - Zone: {props.stop.zoneId}</div>
            {props.stop.trips.map((trip) => {
            return <Trip key={trip.key} trip={trip} />
            })}
        </div>
    );
}

export default Stop;