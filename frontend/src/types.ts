export interface Pixels {
    x: string;
    y: string;
    color: string;
    size: number;
}

export interface Canvas {
    mouseDown: boolean;
    pixelsArray: Pixels[];
    color: string;
    size: number;
}