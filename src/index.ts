import express, { json } from 'express';
import {createServer} from 'http';
import cors from 'cors';
import path from 'path';

import './database/connections';
import 'reflect-metadata';

import routes from './routes';
import setupWebsocket from './websocket';

const app = express();
const server = createServer(app);

setupWebsocket(server)

app.use(cors());
app.use(json());
app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")))
app.use(routes);

server.listen(3333, () => {
    console.log('Server running')
})