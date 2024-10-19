import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

export interface Pixels {
    x: number;
    y: number;
    color: string;
    size: number;
}