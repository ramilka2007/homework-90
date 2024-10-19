import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import type {ActiveConnections, Pixels} from './types';
import config from "./config";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());

const router = express.Router();

const activeConnections: ActiveConnections = {};
let pixels: Pixels[] = []

router.ws('/canvas',  (ws, _req) => {
    const id = crypto.randomUUID();
    console.log('client connected! id=', id);
    activeConnections[id] = ws;

    ws.on('message', (msg) => {
        const decoded = JSON.parse(msg.toString());

        switch (decoded.type) {
            case 'CREATE_PIXELS_ARRAY':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    conn.send(JSON.stringify({
                        type: 'NEW_PIXELS_ARRAY',
                        message: decoded.pixelsArray,
                    }));
                });

                pixels = [...pixels, ...decoded.pixelsArray];
                break;
            case 'CLEAR_CANVAS':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    conn.send(JSON.stringify({
                        type: 'CLEAR_CANVAS',
                    }));
                });

                pixels = [];
                break;
            default:
                console.log('Unknown message type: ', decoded.type);
        }
    });

    ws.on('close', () => {
        console.log('client disconnected! id=', id);
        delete activeConnections[id];
    });
});

app.use(router);

const run = async () => {
    await mongoose.connect(config.database);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);