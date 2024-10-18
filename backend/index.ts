import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import config from "./config";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());

const router = express.Router();

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