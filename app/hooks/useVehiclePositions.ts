'use client';

import { useEffect, useRef, useState } from 'react';
import type { MqttClient } from 'mqtt';
import { cellKey, nearbyCells, parseTopic, vehicleId } from '../lib/hfp/topics';
import type { HfpStatus, VehicleState, VPPayload } from '../lib/hfp/types';

const BROKER = 'wss://mqtt.hsl.fi:443/';
const TICK_MS = 100;
const TAU_MS = 400;
const EXPIRY_MS = 20000;
const KEEPALIVE_S = 30;

const DEBUG =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HFP_DEBUG === '1';

interface DisplayPos {
    lat: number;
    lng: number;
    hdg: number;
}

function easeHeading(from: number, to: number, alpha: number): number {
    let delta = to - from;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    let result = from + delta * alpha;
    if (result < 0) result += 360;
    if (result >= 360) result -= 360;
    return result;
}

export function useVehiclePositions(
    lat: number | null,
    lng: number | null,
    enabled: boolean,
): { vehicles: VehicleState[]; status: HfpStatus } {
    const [vehicles, setVehicles] = useState<VehicleState[]>([]);
    const [status, setStatus] = useState<HfpStatus>('idle');
    const [isVisible, setIsVisible] = useState<boolean>(
        typeof document === 'undefined'
            ? true
            : document.visibilityState !== 'hidden',
    );

    const vehiclesRef = useRef<Map<string, VehicleState>>(new Map());
    const displayRef = useRef<Map<string, DisplayPos>>(new Map());
    const clientRef = useRef<MqttClient | null>(null);
    const subscribedRef = useRef<Set<string>>(new Set());
    const msgCounterRef = useRef<number>(0);

    const hasPosition = lat !== null && lng !== null;
    const key = hasPosition ? cellKey(lat as number, lng as number) : null;

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const onChange = () =>
            setIsVisible(document.visibilityState !== 'hidden');
        document.addEventListener('visibilitychange', onChange);
        return () => document.removeEventListener('visibilitychange', onChange);
    }, []);

    useEffect(() => {
        if (!enabled || !hasPosition || !isVisible) {
            setStatus('idle');
            return;
        }
        let cancelled = false;
        let attempts = 0;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let lastSummaryLog = 0;
        let lastTick = 0;
        const tickTimer = setInterval(() => {
            const now = Date.now();
            const dt = lastTick ? Math.min(now - lastTick, 200) : TICK_MS;
            lastTick = now;
            const alpha = 1 - Math.exp(-dt / TAU_MS);

            const targets = vehiclesRef.current;
            const display = displayRef.current;

            for (const [id, t] of targets) {
                if (now - t.lastSeen > EXPIRY_MS) {
                    targets.delete(id);
                    display.delete(id);
                }
            }

            const out: VehicleState[] = [];
            for (const [id, t] of targets) {
                let d = display.get(id);
                if (!d) {
                    d = { lat: t.lat, lng: t.lng, hdg: t.hdg };
                    display.set(id, d);
                } else {
                    d.lat += (t.lat - d.lat) * alpha;
                    d.lng += (t.lng - d.lng) * alpha;
                    d.hdg = easeHeading(d.hdg, t.hdg, alpha);
                }
                out.push({ ...t, lat: d.lat, lng: d.lng, hdg: d.hdg });
            }
            setVehicles(out);

            if (DEBUG && now - lastSummaryLog >= 5000) {
                lastSummaryLog = now;
                const msgs = msgCounterRef.current;
                msgCounterRef.current = 0;
                console.log(
                    `[hfp] ~${(msgs / 5).toFixed(0)}/s vehicles=${targets.size}`,
                );
            }
        }, TICK_MS);

        const connect = async () => {
            if (cancelled) return;
            setStatus('connecting');
            let mqttMod: typeof import('mqtt');
            try {
                mqttMod = await import('mqtt');
            } catch (e) {
                if (DEBUG) console.error('[hfp] failed to load mqtt', e);
                if (!cancelled) setStatus('error');
                return;
            }
            if (cancelled) return;

            const connectFn =
                (mqttMod as unknown as { default?: { connect: typeof mqttMod.connect } }).default
                    ?.connect ?? mqttMod.connect;

            const client = connectFn(BROKER, {
                keepalive: KEEPALIVE_S,
                reconnectPeriod: 0,
                clean: true,
            });
            clientRef.current = client;

            client.on('connect', () => {
                if (cancelled) return;
                attempts = 0;
                setStatus('live');
                if (lat === null || lng === null) return;
                const topics = nearbyCells(lat, lng);
                subscribedRef.current = new Set(topics);
                client.subscribe(topics, { qos: 0 }, err => {
                    if (DEBUG && err) console.warn('[hfp] subscribe error', err);
                });
            });

            client.on('message', (topic, payload) => {
                const t = parseTopic(topic);
                if (!t) return;
                let parsed: { VP?: VPPayload };
                try {
                    parsed = JSON.parse(payload.toString());
                } catch {
                    return;
                }
                const vp = parsed.VP;
                if (
                    !vp ||
                    typeof vp.lat !== 'number' ||
                    typeof vp.long !== 'number'
                ) {
                    return;
                }
                const id = vehicleId(t.oper, t.veh);
                vehiclesRef.current.set(id, {
                    id,
                    mode: t.mode,
                    route: t.route,
                    dir: t.dir,
                    lat: vp.lat,
                    lng: vp.long,
                    hdg: typeof vp.hdg === 'number' ? vp.hdg : 0,
                    spd: typeof vp.spd === 'number' ? vp.spd : 0,
                    desi: vp.desi ?? '',
                    lastSeen: Date.now(),
                });
                if (DEBUG) msgCounterRef.current++;
            });

            let downHandled = false;
            const handleDown = (err?: Error) => {
                if (cancelled || downHandled) return;
                downHandled = true;
                if (DEBUG && err) console.warn('[hfp] connection down', err);
                if (reconnectTimer) clearTimeout(reconnectTimer);
                setStatus('error');
                clientRef.current = null;
                subscribedRef.current = new Set();
                attempts++;
                const base = Math.min(30000, 1000 * Math.pow(2, attempts));
                const jitter = base * (0.8 + Math.random() * 0.4);
                reconnectTimer = setTimeout(connect, jitter);
            };

            client.on('error', handleDown);
            client.on('close', () => handleDown());
        };

        connect();

        return () => {
            cancelled = true;
            if (reconnectTimer) clearTimeout(reconnectTimer);
            clearInterval(tickTimer);
            const c = clientRef.current;
            clientRef.current = null;
            subscribedRef.current = new Set();
            vehiclesRef.current = new Map();
            displayRef.current = new Map();
            setVehicles([]);
            setStatus('idle');
            if (c) {
                try {
                    c.end(true);
                } catch {
                    // ignore
                }
            }
        };
    }, [enabled, isVisible, hasPosition]);

    useEffect(() => {
        const c = clientRef.current;
        if (!c || !key || lat === null || lng === null) return;
        const desired = new Set(nearbyCells(lat, lng));
        const current = subscribedRef.current;
        const toRemove = [...current].filter(t => !desired.has(t));
        const toAdd = [...desired].filter(t => !current.has(t));
        if (toRemove.length > 0) c.unsubscribe(toRemove);
        if (toAdd.length > 0) c.subscribe(toAdd, { qos: 0 });
        subscribedRef.current = desired;
    }, [key]);

    return { vehicles, status };
}
