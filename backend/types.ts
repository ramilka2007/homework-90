import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

export interface Pixels {
    x: string;
    y: string;
    color: string;
    size: number;
}