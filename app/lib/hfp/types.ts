export type HfpMode = 'bus' | 'tram' | 'metro' | 'train' | 'ferry' | 'ubus' | 'robot' | string;

export interface VPPayload {
    desi?: string;
    dir?: string;
    oper?: number;
    veh?: number;
    tst?: string;
    tsi?: number;
    spd?: number;
    hdg?: number;
    lat?: number;
    long?: number;
    acc?: number;
    dl?: number;
    odo?: number;
    drst?: number;
    oday?: string;
    jrn?: number;
    line?: number;
    start?: string;
    loc?: string;
    stop?: number | null;
    route?: string;
    occu?: number;
}

export interface VehicleState {
    id: string;
    mode: HfpMode;
    route: string;
    dir: string;
    lat: number;
    lng: number;
    hdg: number;
    spd: number;
    desi: string;
    lastSeen: number;
}

export type HfpStatus = 'idle' | 'connecting' | 'live' | 'error';
