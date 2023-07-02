
import Trip from "./trip";

function Stop(props) {

    return (
        <div>
            <div className="bg-orange-500">Stop {props.id}</div>
            
            
            {props.stop.trips.map((trip) => {
            return <Trip key={trip.realTimeDeparture} trip={trip} />
            })}
        </div>
    );
}

export default Stop;