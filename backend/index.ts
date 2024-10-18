import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import type {ActiveConnections, IncomingMessage} from './types';
import config from "./config";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/chat',  (ws, _req) => {
    const id = crypto.randomUUID();
    console.log('client connected! id=', id);
    activeConnections[id] = ws;

    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

        switch (decodedMessage.type) {
            case 'SET_USERNAME':
                username = decodedMessage.payload;
                break;
            case 'SEND_MESSAGE':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    conn.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        payload: {
                            username,
                            text: decodedMessage.payload
                        }
                    }));
                });
                break;
            default:
                console.log('Unknown message type:', decodedMessage.type);
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