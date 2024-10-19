export interface Pixels {
    x: number;
    y: number;
    color: string;
    size: number;
}

export interface Canvas {
    mouseDown: boolean;
    pixelsArray: Pixels[];
    color: string;
    size: number;
}