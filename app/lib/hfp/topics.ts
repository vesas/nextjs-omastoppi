export interface GeohashCell {
    ghHead: string;
    gh1: string;
    gh2: string;
}

export function geohashCell(lat: number, lon: number): GeohashCell {
    const latInt = Math.floor(lat);
    const lonInt = Math.floor(lon);
    const latRest = lat - latInt;
    const lonRest = lon - lonInt;
    const lat1 = Math.floor(latRest * 10) % 10;
    const lon1 = Math.floor(lonRest * 10) % 10;
    const lat2 = Math.floor(latRest * 100) % 10;
    const lon2 = Math.floor(lonRest * 100) % 10;
    return {
        ghHead: `${latInt};${lonInt}`,
        gh1: `${lat1}${lon1}`,
        gh2: `${lat2}${lon2}`,
    };
}

export function cellKey(lat: number, lon: number): string {
    return `${Math.floor(lat * 200)}/${Math.floor(lon * 200)}`;
}

const TOPIC_PREFIX = '/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/+';

export function topicFor(cell: GeohashCell): string {
    return `${TOPIC_PREFIX}/${cell.ghHead}/${cell.gh1}/${cell.gh2}/#`;
}

export function nearbyCells(lat: number, lon: number): string[] {
    const offsets = [-0.005, 0.005];
    const set = new Set<string>();
    for (const dLat of offsets) {
        for (const dLon of offsets) {
            set.add(topicFor(geohashCell(lat + dLat, lon + dLon)));
        }
    }
    return [...set];
}

export interface ParsedTopic {
    mode: string;
    oper: string;
    veh: string;
    route: string;
    dir: string;
}

export function parseTopic(topic: string): ParsedTopic | null {
    const parts = topic.split('/');
    if (parts.length < 11 || parts[1] !== 'hfp') return null;
    return {
        mode: parts[6],
        oper: parts[7],
        veh: parts[8],
        route: parts[9],
        dir: parts[10],
    };
}

export function vehicleId(oper: string, veh: string): string {
    return `${oper}/${veh}`;
}
