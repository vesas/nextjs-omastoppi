'use client';

import { memo, ReactElement } from 'react';
import { Overlay } from 'pigeon-maps';
import type { VehicleState } from './lib/hfp/types';

const MIN_ZOOM = 13;

const MODE_COLOR: Record<string, string> = {
    bus: '#2563eb',
    tram: '#059669',
    metro: '#ea580c',
    train: '#7c3aed',
    ferry: '#0891b2',
    ubus: '#2563eb',
};

interface Bounds {
    ne: [number, number];
    sw: [number, number];
}

interface MarkerVisualProps {
    hdg: number;
    color: string;
    desi: string;
}

function MarkerVisualImpl({ hdg, color, desi }: MarkerVisualProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div
                style={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    transform: `rotate(${hdg}deg)`,
                    transformOrigin: 'center',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                >
                    <path
                        d="M8 1 L14 14 L8 11 L2 14 Z"
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {desi && (
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#fff',
                        background: color,
                        padding: '0 4px',
                        borderRadius: 3,
                        lineHeight: '14px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        textShadow: '0 1px 1px rgba(0,0,0,0.4)',
                    }}
                >
                    {desi}
                </span>
            )}
        </div>
    );
}

const MarkerVisual = memo(MarkerVisualImpl, (prev, next) => {
    if (prev.color !== next.color) return false;
    if (prev.desi !== next.desi) return false;
    if (Math.round(prev.hdg / 5) !== Math.round(next.hdg / 5)) return false;
    return true;
});

function inBounds(lat: number, lng: number, b: Bounds): boolean {
    return (
        lat >= b.sw[0] &&
        lat <= b.ne[0] &&
        lng >= b.sw[1] &&
        lng <= b.ne[1]
    );
}

export function buildVehicleOverlays(
    vehicles: VehicleState[],
    bounds: Bounds | null,
    zoom: number,
): ReactElement[] {
    if (zoom < MIN_ZOOM) return [];
    const visible = bounds
        ? vehicles.filter(v => inBounds(v.lat, v.lng, bounds))
        : vehicles;
    return visible.map(v => (
        <Overlay key={v.id} anchor={[v.lat, v.lng]} offset={[8, 8]}>
            <MarkerVisual
                hdg={v.hdg}
                color={MODE_COLOR[v.mode] ?? '#475569'}
                desi={v.desi || v.route || ''}
            />
        </Overlay>
    ));
}
