import Stop from "./stop";

function StopList(props) {

    return (
        <div>
            {props.stops.map((stop) => {
            return <Stop key={stop.id} stop={stop} />
            })}
        </div>
    );
}

export default StopList;